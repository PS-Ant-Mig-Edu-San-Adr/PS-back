const mongoose = require("mongoose");
const { Schema } = mongoose;

const organizacionSchema = new Schema(
    {
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        miembros: { type: Array, required: false },
        roles: { type: Array, required: false },
        contacto: { type: String, required: false },
        correo: { type: String, required: false },
        web: { type: String, required: false },
        organizaciones: { type: Array, required: false },
        privacidad: { type: Enumerator, required: false }
    },
    { collection: "organizacion", id: true}    
);

module.exports = mongoose.model("organizacion", organizacionSchema);