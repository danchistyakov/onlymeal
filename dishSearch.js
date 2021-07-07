
const { google } = require('googleapis');
const keys = require('./keys.json');

exports.DishSearch = async (filters) => {
    const client = new google.auth.JWT(
        keys.client_email, null, keys.private_key, ['https://www.googleapis.com/auth/spreadsheets']
    );

    const gsrun = async (cl) => {
        const gsapi = google.sheets({ version: 'v4', auth: cl });

        const getOptions = {
            spreadsheetId: '1AfR9fnZOfYsO_zjnb9eHS2gq1gHPEPsRX3Ibu4OCZIM',
            ranges: ['B2:B10', 'D2:10', 'E2:E10'],
        }

        const data = (await gsapi.spreadsheets.values.batchGet(getOptions)).data;
        const meals = data.valueRanges[0].values;
        const images = data.valueRanges[1].values;
        const tags = data.valueRanges[2].values;


        //const filterArrLike = [];
        const filterArrHate = [];

        /*filtersLike.meat && filterArrLike.push('MET');
        filtersLike.milk && filterArrLike.push('MLK');
        filtersLike.fruits && filterArrLike.push('FRT');
        filtersLike.fish && filterArrLike.push('FSH');*/
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
        console.log('FILTER:')
        console.log(filterArrHate);
        const filtered = meals.filter((res, key) => {
            const tagarr = tags[key][0].split(' ');
            const hate = filterArrHate.some(f => tagarr.includes(f));
            /*console.log('DEBUG:')
            console.log(!(tagarr.includes('PIG')))*/
            console.log('ITEM:')
            console.log(res)
            console.log('BOOL:')
            console.log(hate)
            if (hate === false) {
                return res
            }
        }).map((res, key) => (
            { meal: res[0], key: meals.indexOf(res) + 2 }
        ))
        const rand = Math.floor(Math.random() * filtered.length);

        return filtered[rand]
    }

    return await gsrun(client)
    //return { meal: 'Манго' }

}