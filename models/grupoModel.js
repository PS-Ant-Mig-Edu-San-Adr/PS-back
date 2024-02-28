const mongoose = require("mongoose");
const { Schema } = mongoose;

const grupoSchema = new Schema(
    {
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        miembros: { type: Array, required: false },
        eventos: { type: Array, required: false },
        roles: { type: Array, required: false },
        privacidad: { type: Enumerator, required: true },
        horarios: { type: Array, required: false }
    },
    { collection: "grupo", id: true}    
);

module.exports = mongoose.model("grupo", grupoSchema);

