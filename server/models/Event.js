const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "HACKATHON",
                "WORKSHOP",
                "COMPETITION",
                "SEMINAR",
                "CULTURAL",
                "SPORTS",
                "OTHER"
            ]
        },

        type: {
             type: String,
             required: true,
             enum: ["EVENT", "RECRUITMENT"],
             default: "EVENT"
        },

        banner: {
            type: String,
            default: ""
        },

        club: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Club",
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        startTime: {
            type: String,
            required: true
        },

        endTime: {
            type: String,
            required: true
        },

        venue: {
            type: String,
            required: true,
            trim: true
        },

        registrationStart: {
            type: Date,
            required: true
        },

        registrationEnd: {
            type: Date,
            required: true
        },

        capacity: {
            type: Number,
            required: true,
            min: 1
        },

        eligibility: {
            type: String,
            default: ""
        },

        rules: {
            type: String,
            default: ""
        },

        contactInformation: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "UPCOMING",
                "REGISTRATION_OPEN",
                "REGISTRATION_CLOSED",
                "ONGOING",
                "COMPLETED",
                "CANCELLED"
            ],
            default: "UPCOMING"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Event", eventSchema);