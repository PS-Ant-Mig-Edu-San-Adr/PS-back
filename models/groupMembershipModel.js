const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const {RoleEnum } = require('./common/enum');


const GroupMembership = sequelize.define('groupMembership', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM(Object.values(RoleEnum)),
        allowNull: false
    }
}, {
    tableName: 'group_memberships',
    timestamps: false
});

module.exports = {GroupMembership};

