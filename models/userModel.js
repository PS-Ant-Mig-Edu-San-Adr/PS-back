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
        avatar: { type: String, required: false, default: "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?w=1380&t=st=1709673019~exp=1709673619~hmac=9d504ec5aa5c1cd54b6b670aa754df8dd5c68099f78b9fd2241712c0eabd41f0" },
        calendar: { type: mongoose.Schema.Types.ObjectId, ref: 'calendarModel', required: true },
        groups: { type: Array, required: false },
        tags: { type: Array, required: false },
    },
    { collection: "users", id: true }
);

module.exports = mongoose.model("user", userSchema);

