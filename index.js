const TelegramApi = require('node-telegram-bot-api');
const token = process.env.PRODUCTION === 'true' ? '1797063882:AAGUc2f0xS5C7PgAZ8_xINGcA1u6f7wKd_I' : '1757466123:AAHZci-uxpsBBzSVDO-zJLjRuE43c4ODGkc';
const bot = new TelegramApi(token, { polling: true });
const schedule = require('node-schedule');
const { mainKeyboard } = require('./keyboards');
const { handleHateKeyboard, handleMeatKeyboard, handleJunkKeyboard, handleIntervalKeyboard } = require('./handleKeyboards');
const { Scheduler } = require('./Scheduler');
const { DishSearch } = require('./dishSearch');
const { sendRating } = require('./sendRating');
const { Message } = require('./Messages');
//const sequelize = require('./db');
require('./models');
//const Amplitude = require('@amplitude/node');
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://onlymeal:qfGjhhjkmrJ1@onlymeal.wj7vo.mongodb.net/onlymeal?retryWrites=true&w=majority';

const Preferences = mongoose.model('preferences');

//const client = Amplitude.init('f05658fc1d0cc2d7ffb26803b28c00a8');

const sendTime = (time, msg, text) => {
    new schedule.scheduleJob(`*/${time} * * * *`, function () {
        bot.sendMessage(msg.chat.id, text);
    });
}

const subCancel = () => {
    job.cancel();
    bot.sendMessage(msg.chat.id, 'Отменил');
}

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected on app termination');
        process.exit(0);
    });
});

const start = async () => {
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    });

    mongoose.connection.on('connected', (err) => {
        if (err) {
            console.log(`Mongoose error ${err}`);
        } else {
            console.log('Mongoose connected');
        }
    })

    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
    ]);

    bot.on('message', async msg => {
        try {
            await new Preferences({ chatId: msg.chat.id }).save();
        } catch (err) {
            console.log('Existing user')
        }
        Message(bot, msg.chat.id, msg.text)
    });

    //return bot.sendMessage(chatId, 'Извините, непонятно', { parse_mode: "HTML" });
    var hate;
    var meat;
    var junk;
    var interval;

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const messageId = msg.message.message_id;
        const dbdata = await Preferences.findOne({ chatId: chatId }).exec();
        hate = hate === undefined ? dbdata.toObject()?.hate : hate;
        meat = meat === undefined ? dbdata.toObject()?.meat : meat;
        junk = junk === undefined ? dbdata?.junk : junk;
        interval = interval === undefined ? dbdata.toObject()?.interval : interval;

        if (data === 'setRation' || data === 'hateBack') {
            bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/dislike.jpg',
                {
                    caption: '<b>Личные предпочтения</b>\nРасскажи о своих предпочтениях в пище. Может есть что-то, что тебе нельзя (отметь эти категории).',
                    parse_mode: "HTML",
                    reply_markup: handleHateKeyboard(hate),
                });
        }

        if (['hatemilk', 'hatefruits', 'hatevegetables', 'hatefish', 'hatesweet', 'hatesalt'].includes(data)) {
            hate[data.slice(4)] = !hate[data.slice(4)];
            bot.editMessageReplyMarkup(handleHateKeyboard(hate), { message_id: messageId, chat_id: chatId })
        }

        if (data === 'hateMeat') {
            await Preferences.findOneAndUpdate({ chatId: chatId }, { hate: hate })
            bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/meat.jpg',
                {
                    parse_mode: "HTML",
                    caption: '<b>Мясо</b>\nМожет есть что-то, что тебе нельзя (отметь эти категории)',
                    reply_markup: handleMeatKeyboard(meat),
                });
        }

        if (['hatepork', 'hatebeef', 'hatechicken', 'hatemutton'].includes(data)) {
            meat[data.slice(4)] = !meat[data.slice(4)];
            bot.editMessageReplyMarkup(handleMeatKeyboard(meat), { message_id: messageId, chat_id: chatId })
        }

        if (data === 'hateJunk') {
            await Preferences.findOneAndUpdate({ chatId: chatId }, { meat: meat });
            bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/junk.jpg',
                {
                    parse_mode: "HTML",
                    caption: '<b>Фастфуд</b>\nРасскажи как ты относишься к фастфуду, если мы будем тебе его предлагать.',
                    reply_markup: handleJunkKeyboard(junk ? 'no' : 'yes'),
                });
        }

        if ((data === 'junkyes' && junk) || (data === 'junkno' && !junk)) {
            if (data.slice(4) === 'no') {
                junk = true;
                await Preferences.findOneAndUpdate({ chatId: chatId }, { junk: true });
            }

            if (data.slice(4) === 'yes') {
                junk = false;
                await Preferences.findOneAndUpdate({ chatId: chatId }, { junk: false });
            }

            bot.editMessageReplyMarkup(handleJunkKeyboard(data.slice(4)), { message_id: messageId, chat_id: chatId })
        }

        if (['intervalNext', 'hateNext'].includes(data)) {
            bot.sendPhoto(chatId, 'https://cdn.statically.io/img/tangerine.gq/q=91/onlymeal/schedule.jpg',
                {
                    caption: 'Хорошо, как часто мы будем выдавать тебе наши замечательные рецепты и идеи?',
                    reply_markup: handleIntervalKeyboard(interval),
                });
        }

        if (['3td', '1td', '1tw', 'onreq'].includes(data) && data !== interval) {
            interval = data;
            bot.editMessageReplyMarkup(handleIntervalKeyboard(data), { message_id: messageId, chat_id: chatId })
        }

        if (data === 'intervalConfirm') {
            const cancel = true;
            Scheduler(bot, msg, chatId, interval, cancel);
        }

        /*if (data === 'handleStop') {
            const cancel = false;
            Scheduler(bot, msg, chatId, obj.interval, obj, cancel);
        }
        
        if (data === 'handleTry') {
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
                            [{ text: 'Вернуться к фильтрам ⬅️', callback_data: 'setRation' }],
                        ]
                    }
                });
            }
        }*/

        if (data.indexOf('handleRate') !== -1) {
            const key = Number(data.slice(10));
            bot.sendMessage(chatId, 'Как тебе было это блюдо?', {
                reply_markup:
                {
                    mainKeyboard,
                    inline_keyboard: [
                        [{ text: '😩', callback_data: 'handleRating' + key + 1 }, { text: '😟', callback_data: 'handleRating' + key + 2 }, { text: '😬', callback_data: 'handleRating' + key + 3 }, { text: '😎', callback_data: 'handleRating' + key + 4 }, { text: '😍', callback_data: 'handleRating' + key + 5 }]
                    ]
                }
            })
        }

        if (data.indexOf('handleRating') !== -1) {
            const rate = Number(data.slice(-1));
            const key = Number(data.slice(12, -1));
            sendRating(rate, key)
            bot.sendMessage(chatId, 'Спасибо за отзыв!', {
                reply_markup: mainKeyboard,
            })
        }
    })
}
start();