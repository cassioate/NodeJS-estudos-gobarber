import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns'
import Appointment from '../models/Appointment';
import User from '../models/User';

async function validarRequisicao (req, res) {
  const schema = Yup.object().shape({
    provider_id: Yup.number().required(),
    date: Yup.date().required(),
  })

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json( { error: 'Validation fails' });
  }
  return null
}

async function validarProvider(provider_id, res){
  const checkIsProvider = await User.findOne({
    where: { id: provider_id, provider: true}
  })

  if (!checkIsProvider){
    return res.status(401).json( { error: 'You can only appointments with providers!' });
  }
  return null
}

async function validandoSeDataJaPassou(hourStart, res){
  if (isBefore(hourStart, new Date())) {
    return res.status(400).json( { error: 'Past dates are not permit!' });
  }
  return null
}

async function validandoSeProviderJaTemAlgoAgendadoNesseHorario(provider_id, hourStart, res){
  const checkAvailability = await Appointment.findOne({
    where: {
      provider_id,
      canceled_at: null,
      date: hourStart
    }
  })

  if (checkAvailability) {
    return res.status(400).json( { error: 'Appointment date is not available!' });
  }
  return null
}

async function salvandoAppointment(userId, provider_id, hourStart, res){
  const appointment = await Appointment.create({
    user_id: userId,
    provider_id,
    date: hourStart
  })

  return res.json (appointment);
}

class AppointmentController {

  async save(req, res) {

    await validarRequisicao(req, res);
    const { provider_id, date } = req.body
    await validarProvider(provider_id, res);
    const hourStart = startOfHour(parseISO(date));
    await validandoSeDataJaPassou(hourStart, res)
    await validandoSeProviderJaTemAlgoAgendadoNesseHorario(provider_id, hourStart, res)
    const appointment = await salvandoAppointment(req.userId, provider_id, hourStart, res)

    return res.json (appointment);
  }

}

export default new AppointmentController();
