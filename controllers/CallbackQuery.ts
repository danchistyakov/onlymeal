import InitDB from '../services/InitDB';
import UserModel from '../models/UserModel';
import TextMessage from './TextMessage';
import {
  handleHateKeyboard,
  handleIntervalKeyboard,
  handleJunkKeyboard,
  handleMeatKeyboard
} from '../modules/handleKeyboards';
import Dish from '../services/dish';
import Cancel from '../services/canceller';
import {geoKeyboard,mainKeyboard} from '../modules/keyboards';

const CallbackQuery = (bot) => {
  /*let hate = null;
  let meat = null;
  let junk = null;
  let interval = null;*/
  bot.on('callback_query', async msg => {
    //return bot.sendMessage(chatId, 'Извините, непонятно', { parse_mode: "HTML" });
    const {data, message} = msg;
    const chatId = message.chat.id;
    const messageId = message.message_id;
    const dbdata = (await UserModel.findOne({chatId}).exec()).toObject();
    let {hate, interval, junk, meat} = dbdata;

    if (data === 'setRation' || data === 'hateBack') {
      bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/dislike.jpg',
        {
          caption: '<b>Личные предпочтения</b>\nРасскажи о своих предпочтениях в пище. Может есть что-то, что тебе нельзя (отметь эти категории).',
          parse_mode: 'HTML',
          reply_markup: handleHateKeyboard(hate),
        });
    }

    if (['hatemilk', 'hatefruits', 'hatevegetables', 'hatefish', 'hatesweet', 'hatesalt'].includes(data)) {
      hate[data.slice(4)] = !hate[data.slice(4)];
      bot.editMessageReplyMarkup(handleHateKeyboard(hate), {message_id: messageId, chat_id: chatId})
    }

    if (data === 'hateMeat') {
      await UserModel.findOneAndUpdate({chatId: chatId}, {hate: hate})
      bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/meat.jpg',
        {
          parse_mode: 'HTML',
          caption: '<b>Мясо</b>\nМожет есть что-то, что тебе нельзя (отметь эти категории)',
          reply_markup: handleMeatKeyboard(meat),
        });
    }

    if (['hatepork', 'hatebeef', 'hatechicken', 'hatemutton'].includes(data)) {
      meat[data.slice(4)] = !meat[data.slice(4)];
      bot.editMessageReplyMarkup(handleMeatKeyboard(meat), {message_id: messageId, chat_id: chatId})
    }

    if (data === 'hateJunk') {
      await UserModel.findOneAndUpdate({chatId: chatId}, {meat: meat});
      bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/junk.jpg',
        {
          parse_mode: 'HTML',
          caption: '<b>Фастфуд</b>\nРасскажи как ты относишься к фастфуду, если мы будем тебе его предлагать.',
          reply_markup: handleJunkKeyboard(junk ? 'no' : 'yes'),
        });
    }

    if ((data === 'junkyes' && junk) || (data === 'junkno' && !junk)) {
      if (data.slice(4) === 'no') {
        junk = true;
        await UserModel.findOneAndUpdate({chatId: chatId}, {junk: true});
      }

      if (data.slice(4) === 'yes') {
        junk = false;
        await UserModel.findOneAndUpdate({chatId: chatId}, {junk: false});
      }

      bot.editMessageReplyMarkup(handleJunkKeyboard(data.slice(4)), {message_id: messageId, chat_id: chatId});
    }

    if (data === 'hateNext') {
      const dbdata = (await UserModel.findOne({chatId: chatId}, 'timezone').exec()).toObject().timezone.offsetRaw;
      const hours = Math.floor(dbdata / 3600);
      const minutes = Math.floor((dbdata % 3600) / 60);
      bot.sendMessage(chatId, `🌐 Текущий часовой пояс: UTC${dbdata > 0 ? '+' : ''}${dbdata < 0 ? '-' : ''}${dbdata === 0 ? '±' : ''}${hours < 10 ? '0' + Math.abs(hours) : Math.abs(hours)}:${minutes === 0 ? Math.abs(minutes) + '0' : Math.abs(minutes)}\n🛠 Укажите ваш часовой пояс в формате ±ЧЧ:ММ.\n🗺 Или отправьте свою геопозицию.`,
        {
          parse_mode: 'HTML',
          reply_markup: geoKeyboard
        });
    }

    if (['intervalNext'].includes(data)) {
      bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/schedule.jpg',
        {
          caption: 'Хорошо, как часто мы будем выдавать тебе наши замечательные рецепты и идеи?',
          reply_markup: handleIntervalKeyboard(interval),
        });
    }

    if (['3td', '1td', '1tw', 'button'].includes(data) && data !== interval) {
      interval = data;
      await UserModel.findOneAndUpdate({chatId: chatId}, {interval: data});
      bot.editMessageReplyMarkup(handleIntervalKeyboard(data), {message_id: messageId, chat_id: chatId})
    }

    if (data === 'intervalConfirm' && interval !== 'button') {
      //Scheduler(bot, chatId, dbdata, interval, true, false);
    }

    if (data === 'intervalConfirm' && interval === 'button') {
      await Dish(bot, dbdata, chatId);
    }

    if (data === 'stopSending') {
      Cancel();
      bot.sendMessage(chatId, 'Нам жаль, что вы уходите :( Может смените расписание рассылки?');
    }

    if (data.indexOf('handleRate') !== -1) {
      const id = Number(data.slice(10));
      bot.sendMessage(chatId, 'Как тебе было это блюдо?', {
        reply_markup:
          {
            mainKeyboard,
            inline_keyboard: [
              [{text: '😩', callback_data: 'handleRating' + id + 1}, {
                text: '😟',
                callback_data: 'handleRating' + id + 2
              }, {text: '😬', callback_data: 'handleRating' + id + 3}, {
                text: '😎',
                callback_data: 'handleRating' + id + 4
              }, {text: '😍', callback_data: 'handleRating' + id + 5}]
            ]
          }
      })
    }

    if (data.indexOf('handleRating') !== -1) {
      const rate = Number(data.slice(-1));
      const key = Number(data.slice(12, -1)) + 1;
      console.log('RATE: ' + rate);
      console.log('KEY: ' + key);
      //sendRating(rate, key);

      await bot.sendMessage(chatId, 'Спасибо, мы поняли ✅', {
        reply_markup: mainKeyboard,
      });

      //Scheduler(bot, chatId, dbdata, interval, true, true);
    }
  })
}

export default CallbackQuery;