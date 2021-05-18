import { startOfDay, endOfDay, parseISO } from 'date-fns'
import { Op } from 'sequelize'
import Appointment from '../models/Appointment'
import User from '../models/User';

async function verificarSeEProvider(req, res){
  const checkUserProvider = await User.findOne({
    where: {id: req.userId, provider:true},
  })
  if(!checkUserProvider){
    return res.status(401).json( { error: 'User is not a provider!' });
  }
  return null
}

async function realizandoABusca(req){
  const { date, page } = req.query;
  const parsedDate = parseISO(date);

  const appointments = await Appointment.findAll({
    where: {
      provider_id: req.userId,
      canceled_at: null,
      date: {
        [Op.between]: [
          startOfDay(parsedDate),
          endOfDay(parsedDate)
        ]
      },
    },
    order: ['date'],
    limit: 10,
    offset: (page - 1) * 10,
  })

  return appointments
}

class ScheduleController{
  async getAll(req, res){
    await verificarSeEProvider(req, res);
    const appointments = await realizandoABusca(req);
    return res.json(appointments);
  }
}

export default new ScheduleController();
