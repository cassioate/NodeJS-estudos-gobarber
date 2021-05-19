import User from '../models/User';
import Notification from '../schemas/Notification'

async function validarProvider(user_id, res){
  const checkIsProvider = await User.findOne({
    where: { id: user_id, provider: true}
  })

  if (!checkIsProvider){
    return res.status(401).json( { error: 'Only provider can load notifications!' });
  }
  return null
}

async function buscarNotifications(user_id){
 const notifications = await Notification.find({
   user: user_id
 })
  .sort({ createdAt: 'desc' })
  .limit(20);
  return notifications
}

async function atualizarNotification(req){
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { read:true },
    // PARA PODER TRAZER DE VOLTA DO BANCO, SEM ISSO ELE VAI ATUALIZAR NO BANCO MAS NAO TRAZR COMO RESPOSTA
    { new: true }
  )
  return notification
}

class NotificationController {
  async getAll(req, res){
    await validarProvider(req.userId, res);
    const notifications = await buscarNotifications(req.userId);
    return res.json(notifications)
  }

  async update(req, res){
    const notification = await atualizarNotification(req)
    return res.json(notification)
  }
}

export default new NotificationController();
