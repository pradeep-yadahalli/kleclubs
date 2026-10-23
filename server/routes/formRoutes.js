
const express = require("express");
const router = express.Router();

const {
    createForm,
    publishForm,
    getMyForms,
    closeForm,
    reopenForm,
    getPublishedFormByEvent
} = require("../controllers/formController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Get published registration form for an event
router.get(
    "/event/:eventId/published",
    getPublishedFormByEvent
);

// Create Custom Form
router.post(
    "/",
    protect,
    authorizeRoles("CLUB_ADMIN", "SUPER_ADMIN"),
    createForm
);

// Publish Form
router.patch(
    "/:formId/publish",
    protect,
    authorizeRoles("CLUB_ADMIN", "SUPER_ADMIN"),
    publishForm
);

// Get forms created by logged-in admin
router.get(
    "/my-forms",
    protect,
    authorizeRoles("CLUB_ADMIN", "SUPER_ADMIN"),
    getMyForms
);

// Close Form
router.patch(
    "/:formId/close",
    protect,
    authorizeRoles("CLUB_ADMIN", "SUPER_ADMIN"),
    closeForm
);

// Reopen Form
router.patch(
    "/:formId/reopen",
    protect,
    authorizeRoles("CLUB_ADMIN", "SUPER_ADMIN"),
    reopenForm
);

module.exports = router;
