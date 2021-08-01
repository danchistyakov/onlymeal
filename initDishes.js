const { google } = require('googleapis');
const keys = require('./keys.json');
const mongoose = require('mongoose');
require('./models');
const Preferences = mongoose.model('preferences');

exports.initDishes = async (chatId) => {
    const client = new google.auth.JWT(
        keys.client_email, null, keys.private_key, ['https://www.googleapis.com/auth/spreadsheets']
    );

    const gsapi = google.sheets({ version: 'v4', auth: client });

    const getOptions = {
        spreadsheetId: '1AfR9fnZOfYsO_zjnb9eHS2gq1gHPEPsRX3Ibu4OCZIM',
        ranges: ['B2:B', 'E2:E'],
    }

    const data = (await gsapi.spreadsheets.values.batchGet(getOptions)).data;
    const meals = data.valueRanges[0].values.flat();
    const tags = data.valueRanges[1].values.flat();
    const dbdata = (await Preferences.findOne({ chatId: chatId }).exec()).toObject();
    const filters = Object.assign(dbdata.hate, dbdata.meat, dbdata.junk)
    const filterArrHate = [];
    filters.milk && filterArrHate.push('MLK');
    filters.fruits && filterArrHate.push('FRU');
    filters.vegetables && filterArrHate.push('VEG');
    filters.fish && filterArrHate.push('FSH');
    filters.sweet && filterArrHate.push('SUG');
    filters.salt && filterArrHate.push('SAL');
    filters.pork && filterArrHate.push('PIG');
    filters.beef && filterArrHate.push('COW');
    filters.chicken && filterArrHate.push('CHI');
    filters.mutton && filterArrHate.push('MUT');
    filters.junk && filterArrHate.push('BRG');
    var id = [];
    const filtered = meals.filter((res, key) => {
        const tagarr = tags[key].split(' ');
        const hate = filterArrHate.some(f => tagarr.includes(f));
        if (hate === false) {
            id.push(key + 1);
            return res
        }
    }).map((res, key) => (
        id[key]
    ))
    await Preferences.findOneAndUpdate({ chatId: chatId }, {
        dishesId: filtered
    });
}