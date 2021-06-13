import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import auth from '../../config/auth';
import File from '../models/File';

import User from '../models/User';

async function validarRequisicao (req, res) {
  const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required()
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({error: 'Validation fails'});
  }
  return null;
}

async function validarUser (email, password, res) {
  const user = await User.findOne({
    where: { email }, /* poderia ser email: email */
    include: [
      {
        model: File,
        as: 'avatar',
        attributes: ['id', 'path', 'url']
      }
    ]
  })

  if (!user){
    return res.status(401).json({error: 'User not found'});
  }

  if (!(await user.checkPassword(password))){
    return res.status(401).json({erro: 'Password does not match'});
  }
  return user;
}

async function criandoTokenJwt (id, name, email, avatar, provider, res) {
  return res.json({
    user: {
      id,
      name,
      email,
      avatar,
      provider
    },
    token: jwt.sign(
      { id },
      auth.secret,
      { expiresIn: auth.expiresIn},
    ),
  })
}

class SessionController {
  async save(req, res) {

    await validarRequisicao(req, res);
    const { email, password} = req.body;
    const user = await validarUser(email, password, res);
    const { id, name, avatar, provider } = user;
    const retornoJson = criandoTokenJwt(id, name, email, avatar, provider, res)

    return retornoJson
  }
}

export default new SessionController();
