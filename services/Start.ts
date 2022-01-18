import {connect, connection} from 'mongoose';

const Start = async (bot) => {
  await connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

  connection.on('connected', (err) => {
    if (err) {
      console.log(`Mongoose error ${err}`);
    } else {
      console.log('Mongoose connected');
    }
  })

  //process.env.PRODUCTION === 'true' && initScheduler(bot);

  bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
  ]);
}

export default Start;