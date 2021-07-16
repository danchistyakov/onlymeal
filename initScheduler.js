require('./models');
const mongoose = require('mongoose');
const Preferences = mongoose.model('preferences');
const { Scheduler } = require('./Scheduler');

exports.initScheduler = async (bot) => {
    const data = await Preferences.find();
    data.map(async (item, key) => {
        const dbdata = await Preferences.findOne({ chatId: item.chatId }).exec();
        Scheduler(bot, item.chatId, dbdata, item.interval, false);
    })
}