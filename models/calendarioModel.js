const mongoose = require("mongoose");
const { Schema } = mongoose;

const PrivacyEnum = {
    Public: "Public",
    Private: "Private"
};

const calendarSchema = new Schema(
    {
        userID: { type: Schema.Types.ObjectId, ref: "user", required: true },
        privacy: { type: String, enum: Object.values(PrivacyEnum), required: true },
        events: { type: Array, required: true, default: []},
        reminders: { type: Array, required: true, default: []}
    },
    { collection: "calendars", id: true }
);

module.exports = mongoose.model("calendar", calendarSchema);