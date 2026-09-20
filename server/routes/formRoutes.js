const express = require("express");

const {
    createForm,
    publishForm,
    getMyForms,
    closeForm,
    reopenForm
} = require("../controllers/formController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const clubOwnership = require("../middleware/clubOwnershipMiddleware");

const router = express.Router();

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