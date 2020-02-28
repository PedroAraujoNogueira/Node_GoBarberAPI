import * as Yup from 'yup';
import {
  startOfHour, parseISO, isBefore, format, subHours,
} from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  async index(req, resp) { // Método de listagem.
    const { page = 1 } = req.query; // se o page nao for informado, por padrao ele receberá 1.

    const appointment = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: {
        model: User,
        as: 'provider',
        attributes: ['id', 'name'],
        include: {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      },
    });

    return resp.json(appointment);
  }

  async store(req, resp) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return resp.status(400).json({ error: 'Validation fails.' });
    }

    const { provider_id, date } = req.body;

    if (req.userId === provider_id) {
      return resp.status(400).json({ error: 'Você não pode marcar um agendamento com você mesmo.' });
    }

    // Checar se esse usuario é um provedor.
    const isProvider = await User.findOne({ where: { id: provider_id, provider: true } });
    // user_id: !provider_id

    if (!isProvider) {
      return resp.status(401).json({ error: 'You can only create appointments with providers.' });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return resp.status(400).json({ error: 'Past dates are not permitted.' });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return resp.status(400).json({ error: 'Appointment date is not available.' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    const user = await User.findByPk(req.userId);
    const formattedDate = format(hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h.'",
      { locale: pt });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate} `,
      user: provider_id,
    });

    return resp.json(appointment);
  }

  async delete(req, resp) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'provider',
        attributes: ['name', 'email'],
      }, {
        model: User,
        as: 'user',
        attributes: ['name'],
      }],
    });

    // Poderiamos fazer da maneira abaixo para pegar as informaçoes do prestador de servico,
    // porém usaremos o include acima que faz o mesmo papel.
    // const provider = await User.findOne({ where: { id: appointment.provider_id } });

    if (appointment.user_id !== req.userId) {
      return resp.status(401).json({ error: "You don't have permission to cancel this appointment." });
    }

    const dateWithSub = subHours(appointment.date, 2);
    // O metodo subHours subtrai uma quantidade de horas da data que passamos.
    // Os campos de data, quando vem do banco de dados, eles ja vem no formato de data, entao
    // nao precisamos nos preocupar em utilizar o parseIso.

    if (isBefore(dateWithSub, new Date())) {
      return resp.status(401).json({ error: 'You can only cancel to appointments 2 hours in advanced.' });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, { appointment });

    return resp.json(appointment);
  }
}

export default new AppointmentController();
