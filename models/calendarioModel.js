const mongoose = require("mongoose");
const { Schema } = mongoose;

const PrivacidadEnum = {
  Publico: "Público",
  Privado: "Privado"
};

const calendarioSchema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    usuario: { type: Schema.Types.ObjectId, ref: "usuario", required: true },
    privacidad: { type: String, enum: Object.values(PrivacidadEnum), required: true },
    eventos: { type: Array, required: false },
    recordatorios: { type: Array, required: false }
  },
  { collection: "calendario" }
);

module.exports = mongoose.model("calendario", calendarioSchema);
