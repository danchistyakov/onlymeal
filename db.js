const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
    'd6b4n4fbqqcb05',
    'sutefxjmrljhng',
    '7cfa87d5da0818a885968e65c6a2207c3d096c745f00d642b449d759a6731e2d',
    {
        host: 'ec2-34-250-16-127.eu-west-1.compute.amazonaws.com',
        port: '5432',
        dialect: 'postgres',
        ssl: true,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        }
    }
);