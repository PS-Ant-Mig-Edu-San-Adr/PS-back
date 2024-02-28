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
        dias: { type: Array, required: true },
        horas: [horaSchema] 
    },
    { collection: "horario", id: true}
);

module.exports = mongoose.model("horario", horarioSchema);