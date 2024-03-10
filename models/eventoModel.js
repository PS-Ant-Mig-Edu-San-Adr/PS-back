const mongoose = require("mongoose");
const { Schema } = mongoose;

// Definición del enum para 'repetir' y 'estado'
const RepetirEnum = ['Diario', 'Semanal', 'Mensual', 'Anual', 'Ninguno'];
const EstadoEnum = ['Activo', 'Inactivo'];

const eventoSchema = new Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    ubicacion: { type: String, required: false },
    repetir: { type: String, enum: RepetirEnum, required: false, default: 'Ninguno'},
    notas: { type: String, required: false },
    estado: { type: String, enum: EstadoEnum, required: true, default: 'Activo' },
    adjuntos: { type: String, required: false },
    grupo: { type: Number, required: true },
    color: { type: String, required: true }
  },
  { collection: "evento", timestamps: true }
);

module.exports = mongoose.model("Evento", eventoSchema);

