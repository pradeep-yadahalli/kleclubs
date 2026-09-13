const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            lowercase: true,
            trim: true
        },

        username: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["STUDENT", "CLUB_ADMIN", "SUPER_ADMIN"],
            default: "STUDENT"
        },

        collegeId: {
            type: String,
            unique: true,
            sparse: true
        },
        club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    default: null
}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);