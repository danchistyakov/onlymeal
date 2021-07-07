const { DishSearch } = require('./dishSearch');
const { mainKeyboard } = require('./keyboards');

exports.Dish = async (bot, obj, msg) => {
    const answer = await DishSearch(JSON.parse(obj?.like), JSON.parse(obj?.hate));

    if (answer !== 'К сожалению, на данный момент по Вашим фильтрам мы ничего не можем Вам предложить 😔') {
        bot.sendPhoto(chatId, 'https://ik.imagekit.io/onlymeal/Frame_26options_zMmm82QbF.png', {
            caption: answer.meal,
            reply_to_message_id: msg.message_id,
            reply_markup:
            {
                mainKeyboard,
                inline_keyboard: [
                    [{ text: 'Скушано ✅', callback_data: 'handleRate' + answer.key }],
                    [{ text: 'Больше не присылать ✅', callback_data: 'handleStop' }],
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