require('dotenv').config();
import InitDB from './services/InitDB';
import TelegramApi from 'node-telegram-bot-api';
//const Amplitude = require('@amplitude/node');
import {connection} from 'mongoose';
import Start from'./services/Start';
import CallbackQuery from './controllers/CallbackQuery';

//const client = Amplitude.init('f05658fc1d0cc2d7ffb26803b28c00a8');
const token = process.env.PRODUCTION === 'true' ? '1797063882:AAGUc2f0xS5C7PgAZ8_xINGcA1u6f7wKd_I' : '1757466123:AAHZci-uxpsBBzSVDO-zJLjRuE43c4ODGkc';
const bot = new TelegramApi(token, {polling: true});

process.on('SIGINT', function () {
  connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

const App = async () => {
  await Start(bot);
  InitDB(bot);
  CallbackQuery(bot);
}
App();