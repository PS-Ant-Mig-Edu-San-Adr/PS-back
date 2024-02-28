const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventoSchema = new Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    ubicacion: { type: String, required: false },
    repetir: { type: Enumerator, required: false },
    notas: { type: String, required: false },
    estado: { type: Enumerator, required: true },
    adjuntos: { type: Array, required: false },
    grupo: { type: Number, required: true },
  },
  { collection: "evento", id: true}
);

module.exports = mongoose.model("evento", eventoSchema);
