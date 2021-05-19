import { endOfDay, format, isAfter, setHours, setMinutes, setSeconds, startOfDay } from "date-fns";
import { Op } from "sequelize";
import Appointment from '../models/Appointment'

async function validarData(req, res){
  const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date!'})
    }

  return date
}

async function buscarAppointmentsNaData(req, searchDate){
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.id,
        canceled_at: null,
        date: {
          [Op.between]:[startOfDay(searchDate), endOfDay(searchDate)]
        }
      }
    })
  return appointments
}

async function verificarOsHorariosDisponiveisNaData (appointments ,searchDate){
  const schedule = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00'
  ]

  const available = schedule.map( time => {
    const [hour, minute] = time.split(':');
    const value = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0);

    return {
      time,
      value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
      available:
        isAfter(value, new Date()) && !appointments.find(a =>
          format(a.date, 'HH:mm') === time
          )

    }
  });

  return available
}


class AvailableController {
  async getId(req, res){
    const date = await validarData(req, res);
    const searchDate = Number(date);
    const appointments = await buscarAppointmentsNaData(req, searchDate);
    const available = await verificarOsHorariosDisponiveisNaData(appointments ,searchDate);

    return res.json(available)
  }
}

export default new AvailableController()
