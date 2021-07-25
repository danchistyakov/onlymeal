
const { google } = require('googleapis');
const keys = require('./keys.json');
const mongoose = require('mongoose');
require('./models');
const Preferences = mongoose.model('preferences');

exports.DishSearch = async (hate, meat, junk, chatId) => {
    const filters = Object.assign(hate, meat, junk);
    const client = new google.auth.JWT(
        keys.client_email, null, keys.private_key, ['https://www.googleapis.com/auth/spreadsheets']
    );

    const gsrun = async (cl) => {
        const gsapi = google.sheets({ version: 'v4', auth: cl });

        const getOptions = {
            spreadsheetId: '1AfR9fnZOfYsO_zjnb9eHS2gq1gHPEPsRX3Ibu4OCZIM',
            ranges: ['B2:B', 'D2:D', 'E2:E'],
        }

        const data = (await gsapi.spreadsheets.values.batchGet(getOptions)).data;
        const meals = data.valueRanges[0].values;
        const images = data.valueRanges[1].values;
        const tags = data.valueRanges[2].values;
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
        const filtered = meals.filter((res, key) => {
            const tagarr = tags[key][0].split(' ');
            const hate = filterArrHate.some(f => tagarr.includes(f));
            if (hate === false) {
                return res
            }
        }).map((res, key) => (
            { meal: res[0], id: meals.indexOf(res) + 1, image: images[meals.indexOf(res)][0] }
        ))
        const vacant = (await Preferences.findOne({ chatId: chatId }, 'dishesId').exec()).toObject().dishesId;
        const rand = Math.floor(Math.random() * vacant.length);
        const result = filtered.find(item => item.id === vacant[rand]);
        vacant.splice(rand, 1);
        await Preferences.findOneAndUpdate({ chatId: chatId }, {
            dishesId: vacant
        });
        return result
    }

    return await gsrun(client)
}