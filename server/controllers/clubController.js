const Club = require("../models/Club");

// Create Club
const createClub = async (req, res) => {
    try {
        const { name, description, logo } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                message: "Club name and description are required"
            });
        }

        const existingClub = await Club.findOne({ name });

        if (existingClub) {
            return res.status(400).json({
                message: "Club already exists"
            });
        }

        const club = await Club.create({
            name,
            description,
            logo: logo || "",
            admin: null
        });

        res.status(201).json({
            message: "Club created successfully",
            club
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createClub
};