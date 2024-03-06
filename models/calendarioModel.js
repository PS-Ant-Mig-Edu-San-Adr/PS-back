const mongoose = require("mongoose");
const { Schema } = mongoose;

const PrivacidadEnum = {
  Publico: "Público",
  Privado: "Privado"
};

const calendarioSchema = new Schema(
  {
    usuario: { type: Schema.Types.ObjectId, ref: "usuario", required: true },
    privacidad: { type: String, enum: Object.values(PrivacidadEnum), required: true },
    eventos: { type: Array, required: false },
    recordatorios: { type: Array, required: false }
  },
  { collection: "calendario", id: true }
);

module.exports = mongoose.model("calendario", calendarioSchema);
