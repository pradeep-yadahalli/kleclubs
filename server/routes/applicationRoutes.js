const express = require("express");

const {
    submitApplication,
    getEventApplications
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Student submits an application
router.post(
    "/",
    protect,
    authorizeRoles("STUDENT"),
    submitApplication
);

// Club Admin views applications for an event
router.get(
    "/event/:eventId",
    protect,
    authorizeRoles("CLUB_ADMIN", "SUPER_ADMIN"),
    getEventApplications
);

module.exports = router;