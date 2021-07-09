require('./models');
const mongoose = require('mongoose');
const { rationKeyboard } = require('./keyboards');
const { DishSearch } = require('./dishSearch');
const { handleHateKeyboard, handleMeatKeyboard, handleJunkKeyboard, handleIntervalKeyboard } = require('./handleKeyboards');
const { mainKeyboard } = require('./keyboards');

exports.Message = async (bot, chatId, text) => {
    const Preferences = mongoose.model('preferences');

    if (text === '/start') {
        const startSession = async () => {
            try {
                bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/start.jpg',
                    {
                        caption: '<b>Привет, на связи OnlyMeal</b>\nЭто проект созданный решать простую задачу и спасать людей от мучений выбора еды.',
                        reply_markup: rationKeyboard,
                        parse_mode: "HTML",
                    });
            } catch (err) {
                console.log(' '); console.log('Ошибка!'); console.log(' '); console.log(err);
                bot.sendPhoto(chatId, 'https://ik.imagekit.io/onlymeal/Frame_26options_zMmm82QbF.png',
                    {
                        caption: `<b>Произошла ошибка!</b>\nОписание ошибки:\n ${err}`,
                        parse_mode: "HTML",
                    });
            }
        }

        startSession();
    }

    if (text === 'Рацион') {
        const dbdata = (await Preferences.findOne({ chatId: chatId }, 'meat').exec()).toObject()?.meat;
        console.log(dbdata)
        bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/dislike.jpg',
            {
                caption: '<b>Личные предпочтения</b>\nРасскажи о своих предпочтениях в пище. Может есть что-то, что тебе нельзя (отметь эти категории)',
                parse_mode: "HTML",
                reply_markup: handleMeatKeyboard(dbdata),
            })
    }

    if (text === 'Расписание ⏰') {
        const dbdata = (await Preferences.findOne({ chatId: chatId }, 'interval').exec()).toObject()?.interval;
        bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/schedule.jpg',
            {
                caption: 'Хорошо, как часто мы будем выдавать тебе наши замечательные рецепты и идеи?',
                reply_markup: handleIntervalKeyboard(dbdata),
            });
    }

    if (text === 'Блюдо прямо сейчас! 😋') {
        const dbdata = await Preferences.findOne({ chatId: chatId }).exec();
        const filters = Object.assign(dbdata?.toObject()?.hate, dbdata?.toObject()?.meat, { junk: dbdata?.toObject()?.junk });
        const info = await DishSearch(filters);
        if (info !== 'К сожалению, на данный момент по Вашим фильтрам мы ничего не можем Вам предложить 😔') {
            bot.sendPhoto(chatId, 'https://ik.imagekit.io/onlymeal/Frame_26options_zMmm82QbF.png', {
                caption: info.meal,
                reply_markup:
                {
                    mainKeyboard,
                    inline_keyboard: [
                        [{ text: 'Скушано ✅', callback_data: 'handleRate' + info.key }],
                    ]
                }
            });
        } else {
            bot.sendPhoto(chatId, 'https://ik.imagekit.io/onlymeal/Frame_26options_zMmm82QbF.png', {
                caption: info,
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
}