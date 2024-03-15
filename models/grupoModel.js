const mongoose = require("mongoose");
const horarioModel = require("./horarioModel");
const { Schema } = mongoose;

const privacyEnum = ["Público", "Privado"];

const role = ["admin", "member"];

const member = new Schema({
    _id: mongoose.Types.ObjectId,
    role: { type: String, enum: role, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true }
});


const groupSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        members: { type: [member], required: true, default: []},
        events: { type: Array, required: true, default: []},
        privacy: { type: String, enum: privacyEnum, required: true },
        schedules: { type: [horarioModel.schema], required: true, default: []}
    },
    { collection: "groups", id: true}
);

module.exports = mongoose.model("group", groupSchema);

