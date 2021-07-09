const schedule = require('node-schedule');
const { mainKeyboard } = require('./keyboards');
const { Dish } = require('./dish');
const { Cancel } = require('./canceller');

exports.Scheduler = async (bot, msg, dbdata, interval) => {
    const chatId = msg.message.chat.id;
    const date = new Date();
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    if (interval === '3td') {
        await bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/3td.jpg', {
            caption: '<b>3 раза в день</b> ✅\nИменно столько раз мы будем присылать тебе что поесть!',
            parse_mode: "HTML",
            reply_to_message_id: msg.message_id,
            reply_markup: mainKeyboard,
        });

        Cancel();

        schedule.scheduleJob({ hour: 10, minute: 00 }, async () => {
            Dish(bot, dbdata, msg);
            ////////////////////////////////////////////////////////////////
            const cancel = schedule.scheduledJobs;
            for (i = 0; i < Object.keys(cancel).length; i++) {
                console.log(cancel[Object.keys(cancel)[i]].nextInvocation())
            }
        })

        schedule.scheduleJob({ hour: 14, minute: 00 }, async () => {
            Dish(bot, dbdata, msg);
            ////////////////////////////////////////////////////////////////
            const cancel = schedule.scheduledJobs;
            for (i = 0; i < Object.keys(cancel).length; i++) {
                console.log(cancel[Object.keys(cancel)[i]].nextInvocation())
            }
        })

        schedule.scheduleJob({ hour: 20, minute: 00 }, async () => {
            Dish(bot, dbdata, msg);
            ////////////////////////////////////////////////////////////////
            const cancel = schedule.scheduledJobs;
            for (i = 0; i < Object.keys(cancel).length; i++) {
                console.log(cancel[Object.keys(cancel)[i]].nextInvocation())
                console.log('NO MORE TASKS')
            }
        })

        if (date.getHours() > 19 || date.getHours() < 10) {
            date.getHours() > 19 && date.setDate(date.getDate() + 1);
            bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 10:00`, { parse_mode: "HTML" });
        } else {
            if (date.getHours() < 14) {
                bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 14:00`, { parse_mode: "HTML" });
            } else {
                if (date.getHours() < 20) {
                    bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 20:00`, { parse_mode: "HTML" });
                }
            }
        }
    }

    if (interval === '1td') {
        await bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/1td.jpg', {
            caption: '<b>Раз в день</b> ✅\nИменно столько раз мы будем присылать тебе что поесть!',
            parse_mode: "HTML",
            reply_to_message_id: msg.message_id,
            reply_markup: mainKeyboard,
        });

        Cancel();

        schedule.scheduleJob({ hour: 10, minute: 00 }, async () => {
            Dish(bot, dbdata, msg);
            const cancel = schedule.scheduledJobs;
            for (i = 0; i < Object.keys(cancel).length; i++) {
                console.log(cancel[Object.keys(cancel)[i]].nextInvocation())
                console.log('NO MORE TASKS')
            }
        })

        if (date.getHours() > 10) {
            date.setDate(date.getDate() + 1);
            bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 10:00`, { parse_mode: "HTML" });
        } else {
            bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 10:00`, { parse_mode: "HTML" });
        }
    }

    if (interval === '1tw') {
        await bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/1tw.jpg', {
            caption: '<b>Раз в неделю</b> ✅\nИменно столько раз мы будем присылать тебе что поесть!',
            parse_mode: "HTML",
            reply_to_message_id: msg.message_id,
            reply_markup: mainKeyboard,
        });

        Cancel();

        schedule.scheduleJob({ hour: 10, minute: 00 }, async () => {
            Dish(bot, dbdata, msg);
            const cancel = schedule.scheduledJobs;
            for (i = 0; i < Object.keys(cancel).length; i++) {
                console.log(cancel[Object.keys(cancel)[i]].nextInvocation())
                console.log('NO MORE TASKS')
            }
        })

        date.setDate(date.getDate() + 7);
        bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 10:00`, { parse_mode: "HTML" });
    }
}