const mongoose = require("mongoose");
const { Schema } = mongoose;

const calendarioSchema = new Schema(
  {
    usuario: { type: Number, required: true },
    privacidad: { type: Enumerator, required: true },
    eventos: { type: Array, required: false },
    recordatorios: { type: Array, required: false }
  },
  { collection: "calendario", id: true}
);

module.exports = mongoose.model("calendario", calendarioSchema);
