import DishSearcher from './dishSearcher';
import {mainKeyboard} from '../modules/keyboards';

const Dish = async (bot, dbdata, chatId) => {
  const {id, name, image} = await DishSearcher();
  try {
    bot.sendPhoto(chatId, image, {
      caption: `<b>${name}</b>\n\nПриятного аппетита! ☺️`,
      parse_mode: 'HTML',
      reply_markup:
        {
          mainKeyboard,
          inline_keyboard: [
            [{text: 'Съедено ✨', callback_data: 'handleRate' + id}],
          ]
        }
    });
  } catch (err) {
    console.log(err)
    bot.sendPhoto(chatId, 'https://ik.imagekit.io/onlymeal/Frame_26options_zMmm82QbF.png', {
      caption: 'К сожалению, на данный момент по Вашим фильтрам мы ничего не можем Вам предложить 😔',
      reply_markup:
        {
          mainKeyboard,
          inline_keyboard: [
            [{text: '⬅️ Вернуться к фильтрам', callback_data: 'setRation'}],
          ]
        }
    });
  }
}

export default Dish;