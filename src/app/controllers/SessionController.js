import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import auth from '../../config/auth';

import User from '../models/User';

class SessionController {
  async save(req, res) {

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({error: 'Validation fails'});
    }

    const { email, password} = req.body

    const user = await User.findOne({where: { email /* poderia ser email: email */ }})

    if (!user){
      return res.status(401).json({error: 'User not found'});
    }

    if (!(await user.checkPassword(password))){
      return res.status(401).json({erro: 'Password does not match'});
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign(
        { id },
        auth.secret,
        { expiresIn: auth.expiresIn},
      ),
    })

  }
}

export default new SessionController();
