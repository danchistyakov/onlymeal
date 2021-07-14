const axios = require('axios');

exports.Timezone = async (latitude, longitude) => {
    const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${Math.floor(Date.now() / 1000)}&key=AIzaSyA-jdpSKq093-O3FsUBPtyDTlRogkmWHEs&language=ru`;
    const response = (await axios.get(url)).data;
    console.log(response)
    if (response.rawOffset + response.dstOffset < 36000 && response.rawOffset + response.dstOffset > 0) {
        return `+0${Math.abs(Math.floor((response.rawOffset + response.dstOffset) / 3600))}:${(response.rawOffset + response.dstOffset) % 3600 === 0 ? '00' : Math.abs((response.rawOffset + response.dstOffset) % 3600 / 3600 * 60)}`
    }

    if (response.rawOffset + response.dstOffset > 36000) {
        return `+${Math.abs(Math.floor((response.rawOffset + response.dstOffset) / 3600))}:${(response.rawOffset + response.dstOffset) % 3600 === 0 ? '00' : Math.abs((response.rawOffset + response.dstOffset) % 3600 / 3600 * 60)}`
    }

    if (response.rawOffset + response.dstOffset < 0 && response.rawOffset + response.dstOffset > -36000) {
        return `-0${Math.abs(Math.floor((response.rawOffset + response.dstOffset) / 3600))}:${(response.rawOffset + response.dstOffset) % 3600 === 0 ? '00' : Math.abs((response.rawOffset + response.dstOffset) % 3600 / 3600 * 60)}`
    }

    if (response.rawOffset + response.dstOffset < 36000) {
        return `-${Math.abs(Math.floor((response.rawOffset + response.dstOffset) / 3600))}:${(response.rawOffset + response.dstOffset) % 3600 === 0 ? '00' : Math.abs((response.rawOffset + response.dstOffset) % 3600 / 3600 * 60)}`
    }

    if (response.rawOffset + response.dstOffset === 0) {
        return `±00:00`
    }
}