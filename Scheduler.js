const schedule = require('node-schedule');
const { mainKeyboard } = require('./modules/keyboards');
const { Dish } = require('./services/dish');
const { Cancel } = require('./services/canceller');

exports.Scheduler = async (bot, chatId, dbdata, interval, manual, otzyv) => {
    const date = new Date();
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const offsetMos = dbdata.timezone.offsetMos;
    const schdate = new Date();

    if (interval === '3td') {
        if (manual === true && !otzyv) {
            await bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/3td.jpg', {
                caption: '<b>3 раза в день</b> ✅\nИменно столько раз мы будем присылать тебе что поесть!',
                parse_mode: "HTML",
                reply_markup: mainKeyboard,
            });
        }

        Cancel();

        schdate.setHours(10 + Math.floor(offsetMos / 3600));
        schdate.setMinutes(Math.abs((offsetMos % 3600) / 60));
        schdate.setSeconds(0);
        console.log(`CRONTIME: 0 ${schdate.getMinutes()} ${schdate.getHours()} * * * `);

        schedule.scheduleJob(`0 ${schdate.getMinutes()} ${schdate.getHours()} * * * `, () => {
            console.log(`CRONTIMEEXEC: 0 ${schdate.getMinutes()} ${schdate.getHours()} * * * `);
            Dish(bot, dbdata, chatId);
        });

        schdate.setHours(14 + Math.floor(offsetMos / 3600));
        schdate.setMinutes(Math.abs((offsetMos % 3600) / 60));
        schdate.setSeconds(0);
        console.log(`CRONTIME: 0 ${schdate.getMinutes()} ${schdate.getHours()} * * * `);

        schedule.scheduleJob(`0 ${schdate.getMinutes()} ${schdate.getHours()} * * *`, () => {
            console.log(`CRONTIMEEXEC: 0 ${schdate.getMinutes()} ${schdate.getHours()} * * * `);
            Dish(bot, dbdata, chatId);
        });

        schdate.setHours(20 + Math.floor(offsetMos / 3600));
        schdate.setMinutes(Math.abs((offsetMos % 3600) / 60));
        schdate.setSeconds(0);
        console.log(`CRONTIME: 0 ${schdate.getMinutes()} ${schdate.getHours()} * * * `);

        schedule.scheduleJob(`0 ${schdate.getMinutes()} ${schdate.getHours()} * * *`, () => {
            console.log(`CRONTIMEEXEC: 0 ${schdate.getMinutes()} ${schdate.getHours()} * * * `);
            Dish(bot, dbdata, chatId);
        });

        if (manual === true) {
            if (date.getHours() + Math.floor(offsetMos / 3600) > 19 || date.getHours() + Math.floor(offsetMos / 3600) < 10) {
                date.getHours() + Math.floor(offsetMos / 3600) > 19 && date.setDate(date.getDate() + 1);
                bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 10:00`, { parse_mode: "HTML" });
            } else {
                if (date.getHours() < 14 + Math.floor(offsetMos / 3600)) {
                    bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 14:00`, { parse_mode: "HTML" });
                } else {
                    if (date.getHours() < 20 + Math.floor(offsetMos / 3600)) {
                        bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 20:00`, { parse_mode: "HTML" });
                    }
                }
            }
        }
    }

    if (interval === '1td') {
        if (manual === true) {
            await bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/1td.jpg', {
                caption: '<b>Раз в день</b> ✅\nИменно столько раз мы будем присылать тебе что поесть!',
                parse_mode: "HTML",
                reply_markup: mainKeyboard,
            });
        };

        Cancel();

        schdate.setHours(10 + Math.floor(offsetMos / 3600));
        schdate.setMinutes(Math.abs((offsetMos % 3600) / 60));
        schdate.setSeconds(0);
        console.log(`CRONTIME: 0 ${schdate.getMinutes()} ${schdate.getHours()} * * * `);

        schedule.scheduleJob(`0 ${schdate.getMinutes()} ${schdate.getHours()} * * *`, () => {
            Dish(bot, dbdata, chatId);
        });

        if (manual === true) {
            if (date.getHours() + Math.floor(offsetMos / 3600) > 10) {
                date.setDate(date.getDate() + 1);
                bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 10:00`, { parse_mode: "HTML" });
            } else {
                bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 10:00`, { parse_mode: "HTML" });
            }
        }
    }

    if (interval === '1tw') {
        if (manual === true) {
            await bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/1tw.jpg', {
                caption: '<b>Раз в неделю</b> ✅\nИменно столько раз мы будем присылать тебе что поесть!',
                parse_mode: "HTML",
                reply_markup: mainKeyboard,
            });
        }

        Cancel();

        schdate.setHours(10 + Math.floor(offsetMos / 3600));
        schdate.setMinutes(Math.abs((offsetMos % 3600) / 60));
        schdate.setSeconds(0);
        console.log(`CRONTIME: 0 ${schdate.getMinutes()} ${schdate.getHours()} * * * `);

        schedule.scheduleJob(`0 ${schdate.getMinutes()} ${schdate.getHours()} /7 * *`, () => {
            Dish(bot, dbdata, chatId);
        });

        date.setDate(date.getDate() + 7);

        if (manual === true) {
            bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 10:00`, { parse_mode: "HTML" });
        }
    }
}