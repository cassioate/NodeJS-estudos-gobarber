import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns'
import pt from 'date-fns/locale/pt'
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification'
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

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

async function salvandoAppointment(userId, provider_id, hourStart){
  const appointment = await Appointment.create({
    user_id: userId,
    provider_id,
    date: hourStart
  })

  return appointment;
}

async function buscarAppointmentsDoUsuarioQueEstaLogado(req, res){
  const { page = 1} = req.query
  const appointments = await Appointment.findAll({
    where: {user_id: req.userId, canceled_at: null},
    order: ['date'],
    attributes: ['id', 'date'],
    limit: 10,
    offset: (page - 1) * 10,
    include: [
      {
        model: User,
        as: 'provider',
        attributes: ['id', 'name'],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path','url'],
          }
        ]
      }
    ]
  })

  return res.json (appointments);
}

async function notificar(req, hourStart, provider_id){

  const user = await User.findByPk(req.userId);
  const formattedDate = format( hourStart, "'dia' dd 'de' MMMM', às' H:mm'h'", { locale: pt })
  await Notification.create({
    content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
    user: provider_id,
  })

  return null;
}

async function buscandoAgendamento(req, res){
  const appointment = await Appointment.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'provider',
        attributes: ['name', 'email'],
      },
      {
        model: User,
        as: 'user',
        attributes: ['name'],
      }
    ],
  });

  if (appointment.user_id !== req.userId){
    return res.status(401).json( { error: "You don't have permission to cancel this appointment!" });
  }
  return appointment
}

async function validandoData(appointment, res){
  const dateWithSub = subHours(appointment.date, 2);

  if (isBefore(dateWithSub, new Date())){
    return res.status(401).json( { error: "You can only cancel appointments 2 hours in advance!" });
  }
  return null;
}

async function removendoAgendamento(appointment){
  appointment.canceled_at = new Date();
  await appointment.save();
}

async function enviandoEmailParaNotificarCancelamentoViaFila(appointment){
  // APPOINTMENT tem que ser passado como objeto ou dará problema
  await Queue.add(CancellationMail.key, { appointment })
}
class AppointmentController {

  async getAll(req, res){
    const appointments = await buscarAppointmentsDoUsuarioQueEstaLogado(req, res);
    return appointments
  }

  async save(req, res) {

    await validarRequisicao(req, res);
    const { provider_id, date } = req.body
    await validarProvider(provider_id, res);
    const hourStart = startOfHour(parseISO(date));
    await validandoSeDataJaPassou(hourStart, res)
    await validandoSeProviderJaTemAlgoAgendadoNesseHorario(provider_id, hourStart, res)
    const appointment = await salvandoAppointment(req.userId, provider_id, hourStart)

    await notificar(req, hourStart, provider_id);
    return res.json (appointment);
  }

  async delete(req, res){
    const appointment = await buscandoAgendamento(req, res);
    validandoData(appointment, res);
    removendoAgendamento(appointment);
    enviandoEmailParaNotificarCancelamentoViaFila(appointment);
    return res.json(appointment);
  }
}

export default new AppointmentController();
