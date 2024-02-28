const mongoose = require("mongoose");
const { Schema } = mongoose;

const recordatorioSchema = new Schema(
    {
        titulo: { type: String, required: true },
        descripcion: { type: String, required: true },
        fechaInicio: { type: Date, required: true },
        fechaFin: { type: Date, required: true },
        repetir: { type: Enumerator, required: false }
    },
    { collection: "recordatorio", id: true}
);

module.exports = mongoose.model("recordatorio", recordatorioSchema);