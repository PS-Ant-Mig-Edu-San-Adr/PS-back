const mongoose = require('mongoose');
const { Schema } = mongoose;


const horaSchema = new Schema(
    {
        horaInicio: { type: Date, required: true },
        horaFinal: { type: Date, required: true }
    }
);

const horarioSchema = new Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
        dias: { type: Array, required: true },
        horas: [horaSchema] 
    },
    { collection: "horario" }
);

module.exports = mongoose.model("horario", horarioSchema);