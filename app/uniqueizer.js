const { google } = require('googleapis');
const keys = require('../keys.json');
const mongoose = require('mongoose');
require('../models');
const Preferences = mongoose.model('preferences');
const MONGODB_URI = 'mongodb+srv://onlymeal:qfGjhhjkmrJ1@onlymeal.wj7vo.mongodb.net/onlymeal?retryWrites=true&w=majority';

const Uniqueizer = async () => {
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

    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    });

    const dbdata = await Preferences.find();
    dbdata.map(async (item, key) => {
        const filters = Object.assign(item.hate, item.meat, item.junk)
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
        await Preferences.findOneAndUpdate({ chatId: item.chatId }, {
            dishesId: filtered
        });
    })
}

console.log('uniqueized');

Uniqueizer();