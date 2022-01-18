import UserModel from '../models/UserModel';
import TextMessage from '../controllers/TextMessage';


const InitDB = (bot) => {
  bot.on('message', async msg => {
    try {
      await new UserModel({chatId: msg.chat.id}).save();
      //initDishes(msg.chat.id);
    } catch (err) {
      console.log('Existing user');
    }
    return TextMessage(bot, msg);
  });
}

export default InitDB