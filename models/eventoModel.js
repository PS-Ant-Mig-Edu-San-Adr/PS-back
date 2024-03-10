const mongoose = require("mongoose");
const { Schema } = mongoose;

// Definition of enums for 'repeat' and 'status'
const RepeatEnum = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'None'];
const StatusEnum = ['Active', 'Inactive'];

const eventSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        location: { type: String, required: false },
        repeat: { type: String, enum: RepeatEnum, required: false, default: 'None'},
        notes: { type: String, required: false },
        status: { type: String, enum: StatusEnum, required: true, default: 'Active' },
        attachments: { type: String, required: false },
        group: { type: Number, required: true },
        color: { type: String, required: true }
    },
    { collection: "events", timestamps: true }
);

module.exports = mongoose.model("event", eventSchema);