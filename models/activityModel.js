const mongoose = require("mongoose");
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

const activitySchema = new Schema(
    {
            name: { type: String, required: true },
            description: { type: String, required: true },
            groups: { type: Array, required: false, default: []},
            members: { type: [member], required: true },
            privacy: { type: String, enum: privacyEnum, required: true },
    },
    { collection: "activities", id: true}
);

module.exports = mongoose.model("activity", activitySchema);