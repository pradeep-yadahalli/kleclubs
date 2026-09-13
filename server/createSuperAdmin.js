const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const User = require("./models/user");

dotenv.config();

const createSuperAdmin = async () => {
    try {
        await connectDB();

        const existingAdmin = await User.findOne({
            role: "SUPER_ADMIN"
        });

        if (existingAdmin) {
            console.log("Super Admin already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            "Admin@123",
            10
        );

        await User.create({
            name: "System Administrator",
            username: "superadmin",
            password: hashedPassword,
            role: "SUPER_ADMIN"
        });

        console.log("Super Admin created successfully.");
        console.log("Username: superadmin");
        console.log("Password: Admin@123");

        process.exit(0);

    } catch (error) {
        console.error("Error creating Super Admin:", error.message);
        process.exit(1);
    }
};

createSuperAdmin();