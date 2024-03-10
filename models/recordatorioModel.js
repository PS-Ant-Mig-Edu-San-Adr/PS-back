const mongoose = require("mongoose");
const { Schema } = mongoose;

const RepetirEnum = ['Diario', 'Semanal', 'Mensual', 'Anual', 'Ninguno'];

const recordatorioSchema = new Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
        titulo: { type: String, required: true },
        descripcion: { type: String, required: true },
        fechaInicio: { type: Date, required: true },
        fechaFin: { type: Date, required: true },
        repetir: { type: String, enum: RepetirEnum, required: true, default: "Ninguno" },
        color: { type: String, required: true }
    },
    { collection: "recordatorio", timestamps: true}
);

module.exports = mongoose.model("recordatorio", recordatorioSchema);