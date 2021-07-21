var CronJob = require('cron').CronJob;
const { mainKeyboard } = require('./keyboards');
const { Dish } = require('./dish');
const { Cancel } = require('./canceller');

exports.Scheduler = async (bot, chatId, dbdata, interval, manual) => {
    const date = new Date();
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const offsetRaw = dbdata?.timezone?.offsetRaw;
    const offsetMos = dbdata?.timezone?.offsetMos;

    if (interval === '3td') {
        if (manual === true) {
            await bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/3td.jpg', {
                caption: '<b>3 раза в день</b> ✅\nИменно столько раз мы будем присылать тебе что поесть!',
                parse_mode: "HTML",
                reply_markup: mainKeyboard,
            });
        }

        Cancel();

        const schdate = new Date();
        schdate.setHours(10 + Math.floor(offsetMos / 3600))
        schdate.setMinutes(Math.abs((offsetMos % 3600) / 60))
        schdate.setSeconds(0)
        console.log(`0 ${schdate.getMinutes()} ${schdate.getHours()} * * * `);

        const job1 = new CronJob(`0 ${schdate.getMinutes()} ${schdate.getHours()} * * * `, () => {
            Dish(bot, dbdata, chatId);
        })

        job1.start()

        const job2 = new CronJob('00 00 14 * * *', () => {
            Dish(bot, dbdata, chatId);
        })

        job2.start()

        const job3 = new CronJob('00 00 20 * * *', () => {
            Dish(bot, dbdata, chatId);
        })

        job3.start()

        if (manual === true) {
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
    }

    if (interval === '1td') {
        if (manual === true) {
            await bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/1td.jpg', {
                caption: '<b>Раз в день</b> ✅\nИменно столько раз мы будем присылать тебе что поесть!',
                parse_mode: "HTML",
                reply_markup: mainKeyboard,
            });
        }

        Cancel();

        const job1 = new CronJob('00 00 10 * * *', () => {
            Dish(bot, dbdata, chatId);
        })

        job1.start()
        if (manual === true) {
            if (date.getHours() > 10) {
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

        const job1 = new CronJob('00 00 10 /7 * *', () => {
            Dish(bot, dbdata, chatId);
        })

        job1.start()

        date.setDate(date.getDate() + 7);
        if (manual === true) {
            bot.sendMessage(chatId, `<b>Следующее блюдо</b>\n${date.getDate()} ${months[date.getMonth()]} 10:00`, { parse_mode: "HTML" });
        }
    }
}