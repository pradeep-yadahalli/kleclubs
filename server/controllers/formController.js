const Form = require("../models/Form");
const Event = require("../models/Event");

// Create Custom Form
const createForm = async (req, res) => {
    try {
        const {
            title,
            eventId,
            fields
        } = req.body;

        if (!title || !eventId || !fields || fields.length === 0) {
            return res.status(400).json({
                message: "Title, event ID and fields are required"
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        // Club Admin can only create forms for their own club
        if (
            req.user.role === "CLUB_ADMIN" &&
            event.club.toString() !== req.user.club.toString()
        ) {
            return res.status(403).json({
                message: "You can only manage forms for your own club"
            });
        }

        const form = await Form.create({
            title,
            event: eventId,
            createdBy: req.user._id,
            fields,
            status: "DRAFT"
        });

        res.status(201).json({
            message: "Custom form created successfully",
            form
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Publish Form
const publishForm = async (req, res) => {
    try {
        const { formId } = req.params;

        const form = await Form.findById(formId);

        if (!form) {
            return res.status(404).json({
                message: "Form not found"
            });
        }

        // Club Admin can only publish their own form
        if (
            req.user.role === "CLUB_ADMIN" &&
            form.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only publish your own forms"
            });
        }

        // Form must contain at least one field
        if (!form.fields || form.fields.length === 0) {
            return res.status(400).json({
                message: "Form must contain at least one field"
            });
        }

        form.status = "PUBLISHED";

        await form.save();

        res.json({
            message: "Form published successfully",
            form
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get Forms Created by Logged-in Admin
const getMyForms = async (req, res) => {
    try {
        const forms = await Form.find({
            createdBy: req.user._id
        })
            .populate("event", "title date")
            .sort({ createdAt: -1 });

        res.json({
            message: "Forms fetched successfully",
            count: forms.length,
            forms
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
// Close Form
const closeForm = async (req, res) => {
    try {
        const { formId } = req.params;

        const form = await Form.findById(formId);

        if (!form) {
            return res.status(404).json({
                message: "Form not found"
            });
        }

        if (
            req.user.role === "CLUB_ADMIN" &&
            form.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only close your own forms"
            });
        }

        form.status = "CLOSED";
        await form.save();

        res.json({
            message: "Form closed successfully",
            form
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Reopen Form
const reopenForm = async (req, res) => {
    try {
        const { formId } = req.params;

        const form = await Form.findById(formId);

        if (!form) {
            return res.status(404).json({
                message: "Form not found"
            });
        }

        if (
            req.user.role === "CLUB_ADMIN" &&
            form.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only reopen your own forms"
            });
        }

        form.status = "PUBLISHED";
        await form.save();

        res.json({
            message: "Form reopened successfully",
            form
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
module.exports = {
    createForm,
    publishForm,
    getMyForms,
    closeForm,
    reopenForm
};