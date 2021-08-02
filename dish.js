const { DishSearch } = require('./dishSearch');
const { mainKeyboard } = require('./keyboards');

exports.Dish = async (bot, dbdata, chatId) => {
    const answer = await DishSearch(dbdata, chatId);
    try {
        bot.sendPhoto(chatId, answer.image, {
            caption: `<b>${answer.meal}</b>\n\nПриятного аппетита! ☺️`,
            parse_mode: "HTML",
            reply_markup:
            {
                mainKeyboard,
                inline_keyboard: [
                    [{ text: 'Съедено ✨', callback_data: 'handleRate' + answer.id }],
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
                    [{ text: '⬅️ Вернуться к фильтрам', callback_data: 'setRation' }],
                ]
            }
        });
    }
}