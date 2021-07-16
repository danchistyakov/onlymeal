const { DishSearch } = require('./dishSearch');
const { mainKeyboard } = require('./keyboards');

exports.Dish = async (bot, dbdata, msg) => {
    const answer = await DishSearch(dbdata?.hate, dbdata?.meat, dbdata?.junk);
    console.log(msg)

    const chatId = msg.chat.id;
    if (answer !== 'К сожалению, на данный момент по Вашим фильтрам мы ничего не можем Вам предложить 😔') {
        bot.sendPhoto(chatId, answer.image, {
            caption: answer.meal,
            reply_markup:
            {
                mainKeyboard,
                inline_keyboard: [
                    [{ text: 'Скушано ✅', callback_data: 'handleRate' + answer.key }],
                    [{ text: 'Больше не присылать ✅', callback_data: 'stopSending' }],
                ]
            }
        });
    } else {
        bot.sendPhoto(chatId, 'https://ik.imagekit.io/onlymeal/Frame_26options_zMmm82QbF.png', {
            caption: answer,
            reply_to_message_id: msg.message_id,
            reply_markup:
            {
                mainKeyboard,
                inline_keyboard: [
                    [{ text: '⬅️ Вернуться к фильтрам', callback_data: 'setRation' }],
                ]
            }
        });
    }
}