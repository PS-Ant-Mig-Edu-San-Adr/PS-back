const mongoose = require('mongoose');
const { Schema } = mongoose;


const timeSchema = new Schema(
    {
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true }
    }
);

const scheduleSchema = new Schema(
    {
        days: { type: Array, required: true },
        times: [timeSchema]
    },
    { collection: "schedule", id: true}
);

module.exports = mongoose.model("schedule", scheduleSchema);
