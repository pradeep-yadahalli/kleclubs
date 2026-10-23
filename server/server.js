
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const clubRoutes = require("./routes/clubRoutes");
const adminRoutes = require("./routes/adminRoutes");
const eventRoutes = require("./routes/eventRoutes");
const formRoutes = require("./routes/formRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration — allow the local React frontend
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// Parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

// Backend health check
app.get("/", (req, res) => {
    res.send("College Event Management System Backend is Running!");
});

// User routes
app.use("/api/users", userRoutes);

// Authentication routes
app.use("/api/auth", authRoutes);

// Club routes
app.use("/api/clubs", clubRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Event routes
app.use("/api/events", eventRoutes);

// Form routes
app.use("/api/forms", formRoutes);

// Application routes
app.use("/api/applications", applicationRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
