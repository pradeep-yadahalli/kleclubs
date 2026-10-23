const express = require("express");

const {
    submitApplication,
    getEventApplications,
    getMyApplications,
    updateApplicationStatus
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

// Get applications of logged-in student
router.get(
    "/my-applications",
    protect,
    authorizeRoles("STUDENT"),
    getMyApplications
);


 // Club Admin updates an application status
router.patch(
    "/:applicationId/status",
    protect,
    authorizeRoles("CLUB_ADMIN", "SUPER_ADMIN"),
    updateApplicationStatus
);

module.exports = router;