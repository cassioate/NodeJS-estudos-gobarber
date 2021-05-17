import * as Yup from 'yup';
import User from '../models/User';

// SAVE *--------------------*

async function validarRequisicaoSave (req, res) {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required().min(6),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({error: 'Validation fails'});
  }
  return null;
}

async function validarUser (req, res) {
  const userExists = await User.findOne({where : { email: req.body.email }});

  if (userExists){
    return res.status(400).json({error: 'user already exists'});
  }
  return null;
}

async function criandoUser (req, res) {
  const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    });
}

// UPDATE *--------------------*

async function validarRequisicaoUpdate (req, res) {
  const schema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string().email(),
    oldPassword: Yup.string().min(4),
    password: Yup.string().min(4).when('oldPassword', (oldPassword, field) =>
      oldPassword ? field.required() : field,
    ),
    confirmPassword: Yup.string().when('password', (password, field) =>
    password ? field.required().oneOf([Yup.ref('password')]) : field,
  ),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({error: 'Validation fails'});
  }
  return null
}

async function validarEmailEPassword (req, res) {
  const { email, oldPassword } = req.body;
  const user = await User.findByPk(req.userId);

    if (email !== user.email){
      const userExists = await User.findOne({where : { email }});

      if (userExists){
        return res.status(400).json({error: 'user already exists'});
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))){
      return res.status(401).json({error: 'Password does not match'});
    }

  return user
}

async function atualizandoUser (user, req, res) {
  const { id, name, email, provider } = await user.update(req.body);

  return res.json({
    id,
    name,
    email,
    provider
  });
}

class UserController {

  async save (req, res) {
    await validarRequisicaoSave(req, res);
    await validarUser(req, res)
    const retornoJson = await criandoUser(req, res)

    return retornoJson
  }

  async update (req, res) {
    await validarRequisicaoUpdate(req, res)
    const user = await validarEmailEPassword(req, res)
    const retornoJson = await atualizandoUser(user, req, res)

    return retornoJson
  }

}

export default new UserController();
