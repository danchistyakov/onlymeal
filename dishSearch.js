
const { google } = require('googleapis');
const keys = require('./keys.json');

exports.DishSearch = async () => {
    const filtersLike = { meat: true, fruits: true, milk: true, fish: true };
    const filtersHate = { meat: true, fruits: false, milk: true, fish: true };

    const client = new google.auth.JWT(
        keys.client_email, null, keys.private_key, ['https://www.googleapis.com/auth/spreadsheets']

    );

    const gsrun = async (cl) => {
        const gsapi = google.sheets({ version: 'v4', auth: cl });

        const getOptions = {
            spreadsheetId: '1AfR9fnZOfYsO_zjnb9eHS2gq1gHPEPsRX3Ibu4OCZIM',
            ranges: ['A2:A10', 'B2:B10', 'E2:E10'],
        }

        const data = (await gsapi.spreadsheets.values.batchGet(getOptions)).data;
        const keys = data.valueRanges[0].values.flat();
        const meals = data.valueRanges[1].values;
        const filters = data.valueRanges[2].values;


        const filterArrLike = [];
        const filterArrHate = [];

        filtersLike.meat && filterArrLike.push('MET');
        filtersLike.milk && filterArrLike.push('MLK');
        filtersLike.fruits && filterArrLike.push('FRT');
        filtersLike.fish && filterArrLike.push('FSH');
        filtersHate.meat && filterArrHate.push('MET');
        filtersHate.milk && filterArrHate.push('MLK');
        filtersHate.fruits && filterArrHate.push('FRT');
        filtersHate.fish && filterArrHate.push('FSH');

        const filtered = meals.filter((res, key) => {
            const tagarr = filters[key][0].split(' ');
            const like = filterArrLike.some(f => tagarr.includes(f));
            const hate = filterArrHate.some(f => tagarr.includes(f));

            if (hate === false) {
                return res
            }

            /*console.log(filterarr)
            if (filters[key][0].indexOf('MET') !== -1 && filters[key][0].indexOf('PIG') === -1) {
                return res
            }*/
            /*}).map((res, key) => {
                console.log(res, key)
     
            })*/
            //console.log(filtered)

            /*try {
                //return filtered[rand][0]

            } catch (err) {
                return 'К сожалению, на данный момент по Вашим фильтрам мы ничего не можем Вам предложить 😔'
            }*/
        }).map((res, key) => (
            { meal: res[0], key: meals.indexOf(res) + 2 }
        ))
        const rand = Math.floor(Math.random() * filtered.length);

        return filtered[rand]
    }

    return await gsrun(client)

}