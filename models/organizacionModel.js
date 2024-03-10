const mongoose = require("mongoose");
const { Schema } = mongoose;

const organizationSchema = new Schema(
    {
            name: { type: String, required: true },
            description: { type: String, required: true },
            members: { type: Array, required: false },
            roles: { type: Array, required: false },
            contact: { type: String, required: false },
            email: { type: String, required: false },
            website: { type: String, required: false },
            organizations: { type: Array, required: false },
            privacy: { type: Enumerator, required: false }
    },
    { collection: "organization", id: true}
);

module.exports = mongoose.model("organization", organizationSchema);
