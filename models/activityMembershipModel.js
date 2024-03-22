const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const {RoleEnum } = require('./common/enum');

const ActivityMembership = sequelize.define('activity_membership', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    activity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'activities',
            key: 'id'
        }
    },
    role: {
        type: DataTypes.ENUM(Object.values(RoleEnum)),
        allowNull: false
    }
}, {
    tableName: 'activity_memberships',
    timestamps: false
});

module.exports = {ActivityMembership};