const mongoose = require("mongoose");
const { Schema } = mongoose;

// Definition of enums for 'repeat' and 'status'
const RepeatEnum = ['Diario', 'Semanal', 'Mensual', 'Anual', 'Ninguno'];
const StatusEnum = ['Activo', 'Inactivo'];

const eventSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        location: { type: String, required: false },
        repeat: { type: String, enum: RepeatEnum, required: true, default: 'Ninguno'},
        notes: { type: String, required: false },
        status: { type: String, enum: StatusEnum, required: true, default: 'Activo' },
        attachments: { type: String, required: false },
        group: { type: Number, required: true },
        color: { type: String, required: true }
    },
    { collection: "events", timestamps: true, id: true}
);

module.exports = mongoose.model("event", eventSchema);