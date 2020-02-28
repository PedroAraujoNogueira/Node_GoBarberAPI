import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, resp) {
    const isProvider = await User.findOne({ where: { id: req.userId, provider: true } });

    if (!isProvider) {
      return resp
        .status(401)
        .json({ error: 'Only provider can load notifications.' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    }).sort({ createdAt: 'desc' }).limit(20);

    return resp.json(notifications);
  }

  async update(req, resp) {
    // const notification = await Notification.findById(req.params.id);

    // vamos usar o metodo findByIdAndUpdate pq ele ja encontra e adiciona o registro.
    // Como primeiro parametro nós passamos o id do registro e como segundo parametro passamos
    // os campos com os valores que deverao ser atualizados.
    // O terceiro parametro { new: true } serve para que apos atualizada a notificaçao ela seja
    // retornada ja com os campos atualizados. Ou seja, se nao colocarmos o ultimo parametro
    // entao a notificaçao vai ser atualizada porem nao sera retornada a notificaçao atualizada.
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );

    return resp.json(notification);
  }
}


export default new NotificationController();
