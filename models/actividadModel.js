const mongoose = require("mongoose");
const { Schema } = mongoose;

const actividadSchema = new Schema(
    {
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        grupos: { type: Array, required: true },
        miembros: { type: Array, required: true },
        roles: { type: Array, required: true },
        privacidad: { type: Enumerator, required: true },
    },
    { collection: "actividad", id: true}
);

module.exports = mongoose.model("actividad", actividadSchema);
