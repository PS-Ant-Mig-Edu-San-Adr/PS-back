const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { PrivacyEnum} = require('./common/enum');


const Group = sequelize.define('group', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    activity_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    organization_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    privacy: {
        type: DataTypes.ENUM(Object.values(PrivacyEnum)),
        allowNull: false
    }
}, {
    tableName: 'groups',
    timestamps: false
});


module.exports = { Group };