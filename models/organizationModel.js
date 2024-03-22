const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { PrivacyEnum } = require('./common/enum');


const Organization = sequelize.define('organizations', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    parent_organization_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'organizations',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    contact: {
        type: DataTypes.STRING(255)
    },
    email: {
        type: DataTypes.STRING(255)
    },
    domain: {
        type: DataTypes.STRING(255)
    },
    privacy: {
        type: DataTypes.ENUM(Object.values(PrivacyEnum)),
        allowNull: false
    }
}, {
    tableName: 'organizations',
    timestamps: false
});


module.exports = { Organization }; // Asegúrate de exportar el modelo correctamente
