import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      // text: 'Voce tem um novo cancelamento.',
      // Aqui tera o texto do email, poderia inclusive ser um html, para isso usariamos
      // html ao inves de text.
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm'h.'",
          { locale: pt }),
      },
    });
  }
}

export default new CancellationMail();
