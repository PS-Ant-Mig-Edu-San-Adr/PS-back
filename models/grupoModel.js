const mongoose = require("mongoose");
const { Schema } = mongoose;

const groupSchema = new Schema(
    {
            name: { type: String, required: true },
            description: { type: String, required: true },
            members: { type: Array, required: false },
            events: { type: Array, required: false },
            roles: { type: Array, required: false },
            privacy: { type: Enumerator, required: true },
            schedules: { type: Array, required: false }
    },
    { collection: "group", id: true}
);

module.exports = mongoose.model("group", groupSchema);

