const mongoose = require("mongoose");
const { Schema } = mongoose;

const actividadSchema = new Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        grupos: { type: Array, required: true },
        miembros: { type: Array, required: true },
        roles: { type: Array, required: true },
        privacidad: { type: Enumerator, required: true },
    },
    { collection: "actividad"}
);

module.exports = mongoose.model("actividad", actividadSchema);
