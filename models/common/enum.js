// Definir el ENUM para el campo "privacy"
const PrivacyEnum = {
    Private: "privado",
    Public: "público"
};

// Definir el ENUM para el campo repeat
const RepeatEnum = {
    Daily: "diario",
    Weekly: "semanal",
    Monthly: "mensual",
    Yearly: "anual",
    None: "ninguno"
};

// Definir el ENUM para los roles de los miembros
const RoleEnum = {
    Admin: "admin",
    Member: "member"
};

// Definir el ENUM para el estado de las notificaciones
const NotificationStatusEnum = {
    Enabled: "enabled",
    Disabled: "disabled"
};


// Definir el ENUM para los idiomas
const PreferredLanguageEnum = {
    Spanish: "spanish",
    English: "english"
};

// Definir el ENUM para las zonas horarias
const TimeZoneEnum = {
    GMT: "GMT",
    UTC: "UTC",
    CEST: "CEST",
    CDT: "CDT",
    CST: "CST",
    EDT: "EDT",
    EST: "EST",
    PDT: "PDT"
};


module.exports = {
    PrivacyEnum,
    RepeatEnum,
    RoleEnum,
    NotificationStatusEnum,
    PreferredLanguageEnum,
    TimeZoneEnum
};