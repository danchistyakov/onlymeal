const schedule = require('node-schedule');
const { mainKeyboard } = require('./keyboards');
const { Dish } = require('./dish');

exports.Scheduler = async (bot, msg, chatId, interval, cancel) => {
    const date = new Date();
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    if (interval === '3td') {
        if (cancel === true) {
            await bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/3td.jpg', {
                caption: '<b>3 раза в день</b> ✅\nИменно столько раз мы будем присылать тебе что поесть!',
                parse_mode: "HTML",
                reply_to_message_id: msg.message_id,
                reply_markup: mainKeyboard,
            });

            for (i = 0; i < Object.keys(cancel).length; i++) {
                cancel[Object.keys(cancel)[i]].cancel();
            }

            schedule.scheduleJob('10 * * *', async () => {
                Dish(bot, obj, msg);
            })

            schedule.scheduleJob({ hour: 14, minute: 00 }, async () => {
                Dish(bot, obj, msg);
            })

            schedule.scheduleJob({ hour: 20, minute: 00 }, async () => {
                Dish(bot, obj, msg);
            })

            if (date.getHours() > 19) {
                date.setDate(date.getDate() + 1);
                bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 10:00`, { parse_mode: "HTML" });
            } else {
                if (date.getHours() < 10) {
                    bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 10:00`, { parse_mode: "HTML" });
                }
                else {
                    if (date.getHours() < 14) {
                        console.log('joj')
                        bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 14:00`, { parse_mode: "HTML" });
                    } else {
                        if (date.getHours() < 20) {
                            bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 20:00`, { parse_mode: "HTML" });
                        }
                    }
                }
            }

        } else {
            const cancel = schedule.scheduledJobs;
            for (i = 0; i < Object.keys(cancel).length; i++) {
                cancel[Object.keys(cancel)[i]].cancel();
            }
            bot.sendMessage(chatId, 'Нам жаль, что вы уходите :( Может смените расписание рассылки?');
        }
    }

    if (interval === '1td') {
        if (cancel === true) {
            await bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/1td.jpg', {
                caption: '<b>Раз в день</b> ✅\nИменно столько раз мы будем присылать тебе что поесть!',
                parse_mode: "HTML",
                reply_to_message_id: msg.message_id,
                reply_markup: mainKeyboard,
            });

            for (i = 0; i < Object.keys(cancel).length; i++) {
                cancel[Object.keys(cancel)[i]].cancel();
            }

            schedule.scheduleJob({ hour: 10, minute: 00 }, async () => {
                Dish(bot, chatId, obj, msg);
            })

            if (date.getHours() > 10) {
                date.setDate(date.getDate() + 1);
                bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 10:00`, { parse_mode: "HTML" });
            } else {
                bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 10:00`, { parse_mode: "HTML" });
            }

        } else {
            const cancel = schedule.scheduledJobs;
            for (i = 0; i < Object.keys(cancel).length; i++) {
                cancel[Object.keys(cancel)[i]].cancel();
            }
            bot.sendMessage(chatId, 'Нам жаль, что вы уходите :( Может смените расписание рассылки?');
        }
    }

    if (interval === '1tw') {
        if (cancel === true) {
            await bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/1tw.jpg', {
                caption: '<b>Раз в неделю</b> ✅\nИменно столько раз мы будем присылать тебе что поесть!',
                parse_mode: "HTML",
                reply_to_message_id: msg.message_id,
                reply_markup: mainKeyboard,
            });

            for (i = 0; i < Object.keys(cancel).length; i++) {
                cancel[Object.keys(cancel)[i]].cancel();
            }

            schedule.scheduleJob({ hour: 10, minute: 00 }, async () => {
                Dish(bot, chatId, obj, msg);
            })

            date.setDate(date.getDate() + 7);
            bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 10:00`, { parse_mode: "HTML" });

        } else {
            const cancel = schedule.scheduledJobs;
            for (i = 0; i < Object.keys(cancel).length; i++) {
                cancel[Object.keys(cancel)[i]].cancel();
            }
            bot.sendMessage(chatId, 'Нам жаль, что вы уходите :( Может смените расписание рассылки?');
        }
    }

    if (interval === 'onreq') {
        bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/button.jpg', {
            caption: '<b>Режим кнопки</b> ✅\nДа, теперь ты сможешь по своему велению вызвать абсолютно идеальное блюдо для перекуса по своему предпочтению.',
            parse_mode: "HTML",
            reply_to_message_id: msg.message_id,
            reply_markup:
            {
                mainKeyboard,
                inline_keyboard: [
                    [{ text: 'Попробовать', callback_data: 'handleTry' }],
                ]
            }
        });
    }
}