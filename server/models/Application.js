const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        form: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
            required: true
        },

        responses: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },

        status: {
            type: String,
            enum: ["SUBMITTED", "SHORTLISTED", "REJECTED"],
            default: "SUBMITTED"
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.index(
    { student: 1, event: 1 },
    { unique: true }
);

module.exports = mongoose.model("Application", applicationSchema);