const { DishSearch } = require('./dishSearch');
const { mainKeyboard } = require('./keyboards');

exports.Dish = async (bot, dbdata, chatId) => {
    const answer = await DishSearch(dbdata?.hate, dbdata?.meat, dbdata?.junk, chatId);
    try {
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
    } catch (err) {
        bot.sendPhoto(chatId, 'https://ik.imagekit.io/onlymeal/Frame_26options_zMmm82QbF.png', {
            caption: 'К сожалению, на данный момент по Вашим фильтрам мы ничего не можем Вам предложить 😔',
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