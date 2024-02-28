const mongoose = require("mongoose");
const { Schema } = mongoose;

const UsuariosSchema = new Schema(
  {
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    usuario: { type: String, required: true },
    contraseñaHash: { type: String, required: true },
    fechaCreacion: { type: Date, required: false },
    zonaHoraria: { type: Enumerator, required: false },
    idiomaPreferido: { type: Enumerator, required: false },
    configNotificaciones: { type: Enumerator, required: false },
    avatar: { type: String, required: false },
    calendario: { type: Number, required: true },
    grupos: { type: Array, required: false },
    DNI: { type: String, required: true }
  },
  { collection: "usuarios", id: true}
);

module.exports = mongoose.model("usuarios", UsuariosSchema);
