const Application = require("../models/Application");
const Form = require("../models/Form");
const Event = require("../models/Event");

// Submit Application
const submitApplication = async (req, res) => {
    try {
        const {
            eventId,
            formId,
            responses
        } = req.body;

        // Check required data
        if (!eventId || !formId || !responses) {
            return res.status(400).json({
                message: "Event ID, Form ID and responses are required"
            });
        }

        // Check event
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        // Check form
        const form = await Form.findById(formId);

        if (!form) {
            return res.status(404).json({
                message: "Form not found"
            });
        }

        // Make sure form belongs to this event
        if (form.event.toString() !== eventId.toString()) {
            return res.status(400).json({
                message: "Form does not belong to this event"
            });
        }

        // Check whether form is published
        if (form.status !== "PUBLISHED") {
            return res.status(400).json({
                message: "This form is not currently accepting applications"
            });
        }

        // Check registration time
        const now = new Date();

        if (now < event.registrationStart) {
            return res.status(400).json({
                message: "Registration has not started yet"
            });
        }

        if (now > event.registrationEnd) {
            return res.status(400).json({
                message: "Registration has closed"
            });
        }

        // Dynamic required-field validation
        const missingFields = [];

        for (const field of form.fields) {
            const answer = responses[field._id.toString()];

            if (
                field.required &&
                (
                    answer === undefined ||
                    answer === null ||
                    answer === "" ||
                    (Array.isArray(answer) && answer.length === 0)
                )
            ) {
                missingFields.push(field.label);
            }
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Please fill all required fields",
                missingFields
            });
        }

        // Check for duplicate application
        const existingApplication = await Application.findOne({
            student: req.user._id,
            event: eventId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this event"
            });
        }

        // Create application
        const application = await Application.create({
            student: req.user._id,
            event: eventId,
            form: formId,
            responses
        });

        res.status(201).json({
            message: "Application submitted successfully",
            applicationId: application._id
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// View Applications for an Event
const getEventApplications = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Check event
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        // Club Admin can only view applications for their own club
        if (
            req.user.role === "CLUB_ADMIN" &&
            event.club.toString() !== req.user.club.toString()
        ) {
            return res.status(403).json({
                message: "You can only view applications for your own club"
            });
        }

        // Get applications
        const applications = await Application.find({
            event: eventId
        })
            .populate("student", "name email collegeId")
            .populate("event", "title")
            .sort({ createdAt: -1 });

        res.json({
            message: "Applications fetched successfully",
            count: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Export functions
module.exports = {
    submitApplication,
    getEventApplications
};