const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { RepeatEnum } = require('./common/enum');

const Event = sequelize.define('event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    repeat: {
        type: DataTypes.ENUM(Object.values(RepeatEnum)),
        allowNull: false,
        defaultValue: RepeatEnum.None
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    color: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: '#FF0000'
    }
}, {
    tableName: 'events',
    timestamps: false
});


module.exports = {Event};