const TelegramApi = require('node-telegram-bot-api');

const token = '1797063882:AAGUc2f0xS5C7PgAZ8_xINGcA1u6f7wKd_I';
const bot = new TelegramApi(token, { polling: true });
const schedule = require('node-schedule');
const { rationKeyboard, mainKeyboard } = require('./keyboards')
const { handleFavKeyboard, handleHateKeyboard, handleIntervalKeyboard } = require('./handleKeyboards');
const { Scheduler } = require('./Scheduler');
const { DishSearch } = require('./dishSearch');
const { sendRating } = require('./sendRating');
const sequelize = require('./db');
const UserModel = require('./models');
//const Amplitude = require('@amplitude/node');

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

const start = async () => {

    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (e) {
        console.log('Не удаётся подключиться к БД: ', e)
    }

    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        //console.log(msg);
        if (text === '/start') {
            try {
                console.log(' ')
                console.log('Пробуем получить!')
                console.log(' ')
                await UserModel.create({ chatId })
            } catch (err) {
                console.log(' ')
                console.log('Ошибка!')
                console.log(' ')
                console.log(err)
            }
            const startSession = () => {
                bot.sendPhoto(chatId, 'https://ik.imagekit.io/onlymeal/Frame_26options_zMmm82QbF.png',
                    {
                        caption: 'Привет, давай настроим рацион!',
                        reply_markup: rationKeyboard,
                    });
            }
            return startSession()
        }

        if (text === 'Рацион') {
            const obj = await UserModel.findOne({ chatId });
            bot.sendPhoto(chatId, 'https://ik.imagekit.io/onlymeal/Frame_26options_zMmm82QbF.png',
                {
                    caption: 'Расскажи что ты любишь?',
                    reply_markup: handleFavKeyboard(obj?.interval),
                })
        }

        if (text === 'Расписание ⏰') {
            const obj = await UserModel.findOne({ chatId });
            bot.sendPhoto(chatId, 'https://ik.imagekit.io/onlymeal/Frame_26options_zMmm82QbF.png',
                {
                    caption: 'Хорошо, как часто мы будем выдавать тебе наши замечательные рецепты и идеи?',
                    reply_markup: handleIntervalKeyboard(obj?.interval),
                });
        }
        if (text === 'Блюдо прямо сейчас! 😋') {
            const obj = await UserModel.findOne({ chatId });
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
        }
    });

    bot.onText(/\/send/, msg => {
        return sendTime(1, msg, 'текст')
    })

    bot.onText(/\/zamolchi/, msg => {
        return subCancel()
    })

    //return bot.sendMessage(chatId, 'Извините, непонятно', { parse_mode: "HTML" });

    bot.on('callback_query', async msg => {
        //console.log(msg)
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const messageId = msg.message.message_id;
        const obj = await UserModel.findOne({ chatId });
        const likeParsed = JSON.parse(obj?.like);
        const hateParsed = JSON.parse(obj?.hate);
        //console.log(likeParsed)
        if (data === 'setRation' || data === 'hateBack') {
            bot.sendPhoto(chatId, 'https://ik.imagekit.io/onlymeal/Frame_26options_zMmm82QbF.png',
                {
                    caption: 'Расскажи что ты любишь?',
                    reply_markup: handleFavKeyboard(likeParsed),
                });
        }

        if (['likemeat', 'likemilk', 'likefruits', 'likefish'].includes(data)) {
            likeParsed[data.slice(4)] = !likeParsed[data.slice(4)];
            console.log(likeParsed)
            obj.like = JSON.stringify(likeParsed);
            await obj.save();
            bot.editMessageReplyMarkup(handleFavKeyboard(likeParsed), { message_id: messageId, chat_id: chatId })
        }

        if (data === 'likeNext') {
            bot.sendPhoto(chatId, 'https://ik.imagekit.io/onlymeal/Frame_26options_zMmm82QbF.png',
                {
                    caption: 'А что не любишь или не ешь вообще?',
                    reply_markup: handleHateKeyboard(JSON.parse(obj?.hate)),
                });
        }

        if (['hatemeat', 'hatemilk', 'hatefruits', 'hatefish'].includes(data)) {
            hateParsed[data.slice(4)] = !hateParsed[data.slice(4)];
            console.log(hateParsed)
            obj.hate = JSON.stringify(hateParsed);
            await obj.save();
            bot.editMessageReplyMarkup(handleHateKeyboard(hateParsed), { message_id: messageId, chat_id: chatId })
        }

        if (data === 'hateNext') {
            bot.sendPhoto(chatId, 'https://ik.imagekit.io/onlymeal/Frame_26options_zMmm82QbF.png',
                {
                    caption: 'Хорошо, как часто мы будем выдавать тебе наши замечательные рецепты и идеи?',
                    reply_markup: handleIntervalKeyboard(obj?.interval),
                });
        }

        if (['3td', '1td', '1tw', 'onreq'].includes(data)) {
            bot.editMessageReplyMarkup(handleIntervalKeyboard(data), { message_id: messageId, chat_id: chatId })
            obj.interval = data;
            await obj.save();
        }

        if (data === 'dishNext') {
            const cancel = true;
            Scheduler(bot, msg, chatId, obj.interval, obj, cancel);
        }

        if (data === 'handleStop') {
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
        }

        if (data.indexOf('handleRate') !== -1) {
            const key = Number(data.slice(10));
            console.log(key)
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
            //console.log(rate, key)
            sendRating(rate, key)
            bot.sendMessage(chatId, 'Спасибо за отзыв!', {
                reply_markup: mainKeyboard,
            })
        }
    })
}
start();