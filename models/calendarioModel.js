const mongoose = require("mongoose");
const { Schema } = mongoose;

const PrivacyEnum = {
    Public: "Public",
    Private: "Private"
};

const calendarSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "user", required: true },
        privacy: { type: String, enum: Object.values(PrivacyEnum), required: true },
        events: { type: Array, required: false },
        reminders: { type: Array, required: false }
    },
    { collection: "calendar", id: true }
);

module.exports = mongoose.model("calendar", calendarSchema);