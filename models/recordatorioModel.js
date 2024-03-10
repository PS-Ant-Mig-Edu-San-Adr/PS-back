const mongoose = require("mongoose");
const { Schema } = mongoose;

const RepeatEnum = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'None'];

const reminderSchema = new Schema(
    {
            title: { type: String, required: true },
            description: { type: String, required: true },
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true },
            repeat: { type: String, enum: RepeatEnum, required: true, default: "None" },
            color: { type: String, required: true }
    },
    { collection: "reminder", id: true}
);

module.exports = mongoose.model("reminder", reminderSchema);
