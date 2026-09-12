const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.get("/", (req, res) => {
    res.send("College Event Management System Backend is Running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});