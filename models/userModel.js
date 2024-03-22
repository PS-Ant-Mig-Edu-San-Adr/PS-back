const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { NotificationStatusEnum, TimeZoneEnum, PreferredLanguageEnum} = require('./common/enum');

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        // FIXME: Comprobar estabilidad de la validación 
        //validate: {
          //  is: /^[0-9a-f]{64}$/i // Ejemplo de validación para un hash hexadecimal
        //}
    },
    creationDate: {
        type: DataTypes.DATE
    },
    timeZone: {
        type: DataTypes.ENUM(Object.values(TimeZoneEnum)),
        allowNull: false,
        defaultValue: TimeZoneEnum.GMT
    },
    preferredLanguage: {
        type: DataTypes.ENUM(Object.values(PreferredLanguageEnum)),
        allowNull: false,
        defaultValue: PreferredLanguageEnum.Spanish
    },
    notificationSettings: {
        type: DataTypes.ENUM(Object.values(NotificationStatusEnum)),
        allowNull: false,
        defaultValue: NotificationStatusEnum.Enabled
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'https://hips.hearstapps.com/hmg-prod/images/captura-de-pantalla-2023-10-11-a-las-15-43-03-6526a6734d03a.jpg?crop=0.729xw:1.00xh;0.0795xw,0&resize=1200:*'
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        defaultValue: []
    }
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = {User};
