const mongoose = require("mongoose");
const { Schema } = mongoose;

const TimeZone = {
    GMT: "GMT",
    EST: "EST",
    PST: "PST",
};

const PreferredLanguage = {
    Spanish: "Spanish",
    English: "English",
};

// Enumerator for notification configuration
const NotificationConfig = {
    Enabled: "Enabled",
    Disabled: "Disabled",
    OnlyEvents: "OnlyEvents",
    OnlyReminders: "OnlyReminders",
};

const userSchema = new Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        username: { type: String, required: true },
        passwordHash: { type: String, required: true },
        creationDate: { type: Date, required: false },
        timeZone: { type: String, enum: Object.values(TimeZone), required: true, default: "GMT"},
        preferredLanguage: { type: String, enum: Object.values(PreferredLanguage), required: true, default: "Spanish"},
        notificationSettings: { type: String, enum: Object.values(NotificationConfig), required: true, default: "Disabled"},
        avatar: { type: String, required: true, default: "https://hips.hearstapps.com/hmg-prod/images/captura-de-pantalla-2023-10-11-a-las-15-43-03-6526a6734d03a.jpg?crop=0.729xw:1.00xh;0.0795xw,0&resize=1200:*" },
        calendar: { type: mongoose.Schema.Types.ObjectId, ref: 'calendarModel', required: true },
        groups: { type: Array, required: true, default: []},
        tags: { type: Array, required: true, default: []},
    },
    { collection: "users", id: true }
);

module.exports = mongoose.model("user", userSchema);

