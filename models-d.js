const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    chatId: { type: DataTypes.STRING, unique: true },
    like: { type: DataTypes.STRING, defaultValue: JSON.stringify({ meat: false, milk: false, fruits: false, fish: false }) },
    hate: { type: DataTypes.STRING, defaultValue: JSON.stringify({ meat: false, milk: false, fruits: false, fish: false }) },
    interval: { type: DataTypes.STRING },
})

module.exports = User;