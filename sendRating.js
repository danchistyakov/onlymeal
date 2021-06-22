const { google } = require('googleapis');
const keys = require('./keys.json');

exports.sendRating = async (rate, key) => {
    const client = new google.auth.JWT(
        keys.client_email, null, keys.private_key, ['https://www.googleapis.com/auth/spreadsheets']

    );

    const gsapi = google.sheets({ version: 'v4', auth: client });

    const getOptions = {
        spreadsheetId: '1AfR9fnZOfYsO_zjnb9eHS2gq1gHPEPsRX3Ibu4OCZIM',
        ranges: ['G' + key, 'H' + key],
    }

    const data = (await gsapi.spreadsheets.values.batchGet(getOptions)).data;

    const currentNumber = Number(data.valueRanges[0].values[0][0]);
    const currentRate = Number(data.valueRanges[1].values[0][0]);

    const updateOptions = {
        spreadsheetId: '1AfR9fnZOfYsO_zjnb9eHS2gq1gHPEPsRX3Ibu4OCZIM',
        resource: {
            valueInputOption: 'USER_ENTERED',
            data: [
                {
                    range: 'G' + key,
                    values: [[currentNumber + 1]]
                },
                {
                    range: 'H' + key,
                    values: [[currentRate + rate]]
                },
            ]
        }
    }

    //const meal = (await gsapi.spreadsheets.values.get(opt1)).data.values;
    const response = (await gsapi.spreadsheets.values.batchUpdate(updateOptions)).data;
    console.log(JSON.stringify(response, null, 2));

}