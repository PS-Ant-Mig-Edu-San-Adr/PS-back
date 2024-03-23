const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { RepeatEnum } = require('./common/enum');

const Reminder = sequelize.define('reminder', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    repeat: {
        type: DataTypes.ENUM(Object.values(RepeatEnum)),
        allowNull: false
    },
    color: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: '#00FF00'
    }
}, {
    tableName: 'reminders',
    timestamps: false
});

module.exports = { Reminder };