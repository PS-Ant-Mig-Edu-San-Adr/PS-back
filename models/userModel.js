const mongoose = require("mongoose");
const { Schema } = mongoose;

const ZonaHoraria = {
    GMT: "GMT",
    EST: "EST",
    PST: "PST",
};

const IdiomaPreferido = {
    Español: "Español",
    Inglés: "Inglés",
};

// Enumerador para la configuración de notificaciones
const ConfigNotificaciones = {
    Activadas: "Activadas",
    Desactivadas: "Desactivadas",
    soloEventos: "soloEventos",
    soloRecordatorios: "soloRecordatorios",
};

const usuarioSchema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    usuario: { type: String, required: true },
    contraseñaHash: { type: String, required: true },
    fechaCreacion: { type: Date, required: false },
    zonaHoraria: { type: String, enum: Object.values(ZonaHoraria), required: false },
    idiomaPreferido: { type: String, enum: Object.values(IdiomaPreferido), required: false },
    configNotificaciones: { type: String, enum: Object.values(ConfigNotificaciones), required: false },
    avatar: { type: String, required: false },
    calendario: { type: mongoose.Schema.Types.ObjectId, ref: 'calendarioModel', required: true },
    grupos: { type: Array, required: false },
    DNI: { type: String, required: false },
    etiquetas: { type: Array, required: false },
  },
  { collection: "usuario" }
);

module.exports = mongoose.model("usuario", usuarioSchema);
