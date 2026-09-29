const express = require("express");

const { createEvent, getAllEvents, getEventById,updateEvent,cancelEvent }
 = require("../controllers/eventController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const clubOwnership = require("../middleware/clubOwnershipMiddleware");

const router = express.Router();

// Get all events
router.get("/", getAllEvents);

// Get single event
router.get("/:eventId", getEventById);

// Create Event
// Club Admin → only their own club
// Super Admin → any club
router.post(
    "/",
    protect,
    authorizeRoles("CLUB_ADMIN", "SUPER_ADMIN"),
    clubOwnership,
    createEvent
);

// Update event
router.put(
    "/:eventId",
    protect,
    authorizeRoles("CLUB_ADMIN", "SUPER_ADMIN"),
    updateEvent
);

// Cancel event
router.patch(
    "/:eventId/cancel",
    protect,
    authorizeRoles("CLUB_ADMIN", "SUPER_ADMIN"),
    cancelEvent
);

module.exports = router;