const mongoose = require("mongoose");
const { Schema } = mongoose;

const activitySchema = new Schema(
    {
            name: { type: String, required: true },
            description: { type: String, required: true },
            groups: { type: Array, required: true },
            members: { type: Array, required: true },
            roles: { type: Array, required: true },
            privacy: { type: Enumerator, required: true },
    },
    { collection: "activities", id: true}
);

module.exports = mongoose.model("activitiy", activitySchema);