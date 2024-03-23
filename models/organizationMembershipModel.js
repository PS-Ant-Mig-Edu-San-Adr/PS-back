const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const {RoleEnum } = require('./common/enum');

const OrganizationMembership = sequelize.define('organization_membership', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    organization_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM(Object.values(RoleEnum)),
        allowNull: false
    }
}, {
    tableName: 'organization_memberships',
    timestamps: false
});


module.exports = {OrganizationMembership};