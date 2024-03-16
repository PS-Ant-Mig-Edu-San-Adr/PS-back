const mongoose = require('mongoose');
const { Schema } = mongoose;

const scheduleSchema = new Schema(
    {
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        day: { type: String, required: true }
    },
    { collection: "schedules", id: true}
);

module.exports = mongoose.model("schedule", scheduleSchema);
