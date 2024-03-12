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
        timeZone: { type: String, enum: Object.values(TimeZone), required: false },
        preferredLanguage: { type: String, enum: Object.values(PreferredLanguage), required: false },
        notificationSettings: { type: String, enum: Object.values(NotificationConfig), required: false },
        avatar: { type: String, required: false },
        calendar: { type: mongoose.Schema.Types.ObjectId, ref: 'calendarModel', required: true },
        groups: { type: Array, required: false },
        ID: { type: String, required: false },
        tags: { type: Array, required: false },
    },
    { collection: "users", id: true }
);

module.exports = mongoose.model("user", userSchema);

