const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Student Registration
const registerStudent = async (req, res) => {
    try {
        const { name, email, password, collegeId } = req.body;

        if (!name || !email || !password || !collegeId) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { collegeId }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Student already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            collegeId,
            role: "STUDENT"
        });

        res.status(201).json({
            message: "Student registered successfully",
            userId: user._id
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Login
const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const user = await User.findOne({
            $or: [
                { email: email || "" },
                { username: username || "" }
            ]
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    registerStudent,
    login
};