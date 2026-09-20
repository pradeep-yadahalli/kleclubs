const mongoose = require("mongoose");

const formFieldSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: true,
            trim: true
        },

        fieldType: {
            type: String,
            required: true,
            enum: [
                "TEXT",
                "EMAIL",
                "NUMBER",
                "PHONE",
                "TEXTAREA",
                "DROPDOWN",
                "RADIO",
                "CHECKBOX",
                "DATE",
                "FILE"
            ]
        },

        options: {
            type: [String],
            default: []
        },

        required: {
            type: Boolean,
            default: false
        },

        placeholder: {
            type: String,
            default: ""
        },

        minLength: {
            type: Number,
            default: null
        },

        maxLength: {
            type: Number,
            default: null
        },

        minValue: {
            type: Number,
            default: null
        },

        maxValue: {
            type: Number,
            default: null
        },

        allowedFileTypes: {
            type: [String],
            default: []
        },

        maxFileSize: {
            type: Number,
            default: null
        }
    },
    {
        _id: true
    }
);

const formSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        fields: {
            type: [formFieldSchema],
            required: true
        },

        status: {
            type: String,
            enum: ["DRAFT", "PUBLISHED", "CLOSED"],
            default: "DRAFT"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Form", formSchema);