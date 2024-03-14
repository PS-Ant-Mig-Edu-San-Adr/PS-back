const mongoose = require("mongoose");
const { Schema } = mongoose;
const activityModel = require("./activityModel");

const privacyEnum = ["Público", "Privado"];

const role = ["admin", "member"];

const member = new Schema({
    _id: mongoose.Types.ObjectId,
    role: { type: String, enum: role, required: true }
});

const organizationSchema = new Schema(
    {
            name: { type: String, required: true },
            description: { type: String, required: true },
            members: { type: [member], required: true },
            contact: { type: String, required: false },
            email: { type: String, required: false },
            domain: { type: String, required: false },
            organizations: { type: Array, required: false },
            privacy: { type: String, enum: privacyEnum, default: "Público", required: true },
            activities: [{ type: Schema.Types.ObjectId, ref: 'activity' }]

    },
    { collection: "organizations", id: true}
);

module.exports = mongoose.model("organization", organizationSchema);
