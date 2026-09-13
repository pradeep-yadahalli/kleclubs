const User = require("../models/user");
const Club = require("../models/Club");
const bcrypt = require("bcryptjs");

// Create Club Admin
const createClubAdmin = async (req, res) => {
    try {
        const { name, username, password, clubId } = req.body;

        if (!name || !username || !password || !clubId) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check whether club exists
        const club = await Club.findById(clubId);

        if (!club) {
            return res.status(404).json({
                message: "Club not found"
            });
        }

        // Check whether club already has an admin
        if (club.admin) {
            return res.status(400).json({
                message: "This club already has an admin"
            });
        }

        // Check whether username is already used
        const existingAdmin = await User.findOne({ username });

        if (existingAdmin) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Club Admin
        const admin = await User.create({
            name,
            username,
            password: hashedPassword,
            role: "CLUB_ADMIN",
            club: club._id
        });

        // Assign admin to club
        club.admin = admin._id;
        await club.save();

        res.status(201).json({
            message: "Club Admin created successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                username: admin.username,
                role: admin.role,
                club: admin.club
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createClubAdmin
};