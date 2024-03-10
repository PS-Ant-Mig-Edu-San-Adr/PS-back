const mongoose = require("mongoose");
const { Schema } = mongoose;

const grupoSchema = new Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        miembros: { type: Array, required: false },
        eventos: { type: Array, required: false },
        roles: { type: Array, required: false },
        privacidad: { type: Enumerator, required: true },
        horarios: { type: Array, required: false }
    },
    { collection: "grupo" }    
);

module.exports = mongoose.model("grupo", grupoSchema);

