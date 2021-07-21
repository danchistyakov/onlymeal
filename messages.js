require('./models');
const mongoose = require('mongoose');
const { rationKeyboard, geoKeyboard } = require('./keyboards');
const { handleMeatKeyboard, handleIntervalKeyboard } = require('./handleKeyboards');
const { UTCKeyboard } = require('./keyboards');
const { Dish } = require('./dish');
const { Timezone } = require('./timezone');

exports.Message = async (bot, msg) => {
    const Preferences = mongoose.model('preferences');
    const chatId = msg.chat.id;
    const text = msg.text;
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

    if (text === 'Расписание ⏰' || text === 'Расписание') {
        const dbdata = (await Preferences.findOne({ chatId: chatId }, 'timezone').exec()).toObject().timezone.offsetRaw;
        const hours = Math.floor(dbdata / 3600);
        const minutes = Math.floor((dbdata % 3600) / 60);
        bot.sendMessage(chatId, `🌐 Текущий часовой пояс: UTC${dbdata > 0 ? '+' : ''}${dbdata === 0 ? '±' : ''}${hours < 10 ? '0' + hours : hours}:${minutes === 0 ? minutes + '0' : minutes}\n🛠 Укажите ваш часовой пояс в формате ±ЧЧ:ММ.\n🗺 Или отправьте свою геопозицию.`,
            {
                parse_mode: "HTML",
                reply_markup: geoKeyboard
            });
    }

    if (msg.location !== undefined) {
        bot.sendMessage(chatId, `🌐 Ваш часовой пояс: UTC${await Timezone(msg.location.latitude, msg.location.longitude, chatId)}`,
            {
                parse_mode: "HTML",
                reply_markup: UTCKeyboard
            });
    }

    if (text.indexOf(':') !== -1 && (text.indexOf('+') !== -1 || text.indexOf('-') !== -1 || text.indexOf('±') !== -1)) {
        const hours = Number(text.slice(0, -3)) * 3600;
        const minutes = Number(text.slice(4)) * 60;
        await Preferences.findOneAndUpdate({ chatId: chatId }, { timezone: { offsetRaw: hours > 0 ? hours + minutes : hours - minutes, offsetMos: (hours > 0 ? hours + minutes : hours - minutes) - 10800 } });
        bot.sendMessage(msg.chat.id, `🌐 Ваш часовой пояс: UTC${text}`,
            {
                parse_mode: "HTML",
                reply_markup: UTCKeyboard
            });
    }

    if (text === '❌ Пропустить') {
        const dbdata = (await Preferences.findOne({ chatId: chatId }, 'interval').exec()).toObject()?.interval;
        bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/schedule.jpg',
            {
                caption: 'Хорошо, как часто мы будем выдавать тебе наши замечательные рецепты и идеи?',
                reply_markup: handleIntervalKeyboard(dbdata),
            });
    }

    if (text === 'Блюдо прямо сейчас! 😋') {
        const dbdata = (await Preferences.findOne({ chatId: chatId }).exec())?.toObject();
        Dish(bot, dbdata, msg.chat.id);
    }
}