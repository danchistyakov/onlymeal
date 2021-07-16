const { DishSearch } = require('./dishSearch');
const { mainKeyboard } = require('./keyboards');

exports.Dish = async (bot, dbdata, chatId) => {
    const answer = await DishSearch(dbdata?.hate, dbdata?.meat, dbdata?.junk);

    if (answer !== 'К сожалению, на данный момент по Вашим фильтрам мы ничего не можем Вам предложить 😔') {
        bot.sendPhoto(chatId, answer.image, {
            caption: answer.meal,
            reply_markup:
            {
                mainKeyboard,
                inline_keyboard: [
                    [{ text: 'Съедено ✨', callback_data: 'handleRate' + answer.key }],
                ]
            }
        });
    } else {
        bot.sendPhoto(chatId, 'https://ik.imagekit.io/onlymeal/Frame_26options_zMmm82QbF.png', {
            caption: answer,
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