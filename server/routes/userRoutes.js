const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.post("/test", async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            collegeId: req.body.collegeId
        });

        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;