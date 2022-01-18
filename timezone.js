const mongoose = require('mongoose');
const axios = require('axios');
import UserModel from './models/UserModel';

const Timezone = async (latitude, longitude, chatId) => {
  const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${Math.floor(Date.now() / 1000)}&key=AIzaSyA-jdpSKq093-O3FsUBPtyDTlRogkmWHEs&language=ru`;
  const {data} = await axios.get(url);

  await UserModel.findOneAndUpdate({chatId: chatId}, {
    timezone: {
      offsetRaw: data.rawOffset + data.dstOffset,
      offsetMos: (data.rawOffset + data.dstOffset) - 10800
    }
  });

  if (data.rawOffset + data.dstOffset < 36000 && data.rawOffset + data.dstOffset > 0) {
    return `+0${Math.abs(Math.floor((data.rawOffset + data.dstOffset) / 3600))}:${(data.rawOffset + data.dstOffset) % 3600 === 0 ? '00' : Math.abs((data.rawOffset + data.dstOffset) % 3600 / 3600 * 60)}`
  }

  if (data.rawOffset + data.dstOffset > 36000) {
    return `+${Math.abs(Math.floor((data.rawOffset + data.dstOffset) / 3600))}:${(data.rawOffset + data.dstOffset) % 3600 === 0 ? '00' : Math.abs((data.rawOffset + data.dstOffset) % 3600 / 3600 * 60)}`
  }

  if (data.rawOffset + data.dstOffset < 0 && data.rawOffset + data.dstOffset > -36000) {
    return `-0${Math.abs(Math.floor((data.rawOffset + data.dstOffset) / 3600))}:${(data.rawOffset + data.dstOffset) % 3600 === 0 ? '00' : Math.abs((data.rawOffset + data.dstOffset) % 3600 / 3600 * 60)}`
  }

  if (data.rawOffset + data.dstOffset < 36000) {
    return `-${Math.abs(Math.floor((data.rawOffset + data.dstOffset) / 3600))}:${(data.rawOffset + data.dstOffset) % 3600 === 0 ? '00' : Math.abs((data.rawOffset + data.dstOffset) % 3600 / 3600 * 60)}`
  }

  if (data.rawOffset + data.dstOffset === 0) {
    return `±00:00`
  }
}

export default Timezone;