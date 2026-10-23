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

        
        // Prevent applications for cancelled events
        if (event.status === "CANCELLED") {
            return res.status(400).json({
                message: "Registration is unavailable because this event has been cancelled"
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

        
        // Validate answer types and field constraints
        const validationErrors = [];

        for (const field of form.fields) {
            const fieldId = field._id.toString();
            const answer = responses[fieldId];

            // Skip unanswered optional fields
            if (
                answer === undefined ||
                answer === null ||
                answer === ""
            ) {
                continue;
            }

            const value = String(answer).trim();

            switch (field.fieldType) {
                case "TEXT":
                case "TEXTAREA":
                    if (typeof answer !== "string") {
                        validationErrors.push(
                            `${field.label} must be text`
                        );
                        break;
                    }

                    if (
                        field.minLength !== null &&
                        field.minLength !== undefined &&
                        value.length < field.minLength
                    ) {
                        validationErrors.push(
                            `${field.label} is too short`
                        );
                    }

                    if (
                        field.maxLength !== null &&
                        field.maxLength !== undefined &&
                        value.length > field.maxLength
                    ) {
                        validationErrors.push(
                            `${field.label} is too long`
                        );
                    }
                    break;

                case "EMAIL":
                    if (
                        typeof answer !== "string" ||
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ) {
                        validationErrors.push(
                            `${field.label} must be a valid email`
                        );
                    }
                    break;

                case "NUMBER": {
                    const numberValue = answer;

                    if (
                        typeof numberValue !== "number" ||
                        !Number.isFinite(numberValue)
                    ) {
                        validationErrors.push(
                            `${field.label} must be a number`
                        );
                        break;
                    }

                    if (
                        field.minValue !== null &&
                        field.minValue !== undefined &&
                        numberValue < field.minValue
                    ) {
                        validationErrors.push(
                            `${field.label} is below the minimum value`
                        );
                    }

                    if (
                        field.maxValue !== null &&
                        field.maxValue !== undefined &&
                        numberValue > field.maxValue
                    ) {
                        validationErrors.push(
                            `${field.label} exceeds the maximum value`
                        );
                    }
                    break;
                }

                case "PHONE":
                    if (
                        typeof answer !== "string" ||
                        !/^\+?[0-9\s()-]{7,20}$/.test(value)
                    ) {
                        validationErrors.push(
                            `${field.label} must be a valid phone number`
                        );
                    }
                    break;

                case "DROPDOWN":
                case "RADIO":
                    if (
                        typeof answer !== "string" ||
                        !field.options.includes(answer)
                    ) {
                        validationErrors.push(
                            `${field.label} has an invalid selection`
                        );
                    }
                    break;

                case "CHECKBOX":
                    if (
                        !Array.isArray(answer) ||
                        !answer.every(
                            item =>
                                typeof item === "string" &&
                                field.options.includes(item)
                        )
                    ) {
                        validationErrors.push(
                            `${field.label} contains invalid selections`
                        );
                    }
                    break;

                case "DATE":
                    if (
                        typeof answer !== "string" ||
                        !/^\d{4}-\d{2}-\d{2}$/.test(answer) ||
                        !Number.isFinite(Date.parse(answer)) ||
                        new Date(answer).toISOString().slice(0, 10) !== answer
                    ) {
                        validationErrors.push(
                            `${field.label} must be a valid date in YYYY-MM-DD format`
                        );
                    }
                    break;

                case "FILE":
                    validationErrors.push(
                        `${field.label} file uploads are not supported by this submission API yet`
                    );
                    break;
            }
        }

        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: "Please correct the submitted answers",
                validationErrors
            });
        }


        
        // Check event registration capacity
        if (
            event.capacity !== undefined &&
            event.capacity !== null &&
            event.capacity > 0
        ) {
            const totalApplications = await Application.countDocuments({
                event: eventId
            });

            if (totalApplications >= event.capacity) {
                return res.status(400).json({
                    message: "Sorry, this event has reached its registration capacity"
                });
            }
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


// Get applications of logged-in student
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            student: req.user._id
        })
            .populate("event", "title date venue status")
            .populate("form", "title")
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


 // Update Application Status
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        // Allow only these status updates
        const allowedStatuses = ["SHORTLISTED", "REJECTED"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Status must be SHORTLISTED or REJECTED"
            });
        }

        // Find the application
        const application = await Application.findById(applicationId)
            .populate("event");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        const event = application.event;

        // Check club ownership
        if (
            req.user.role === "CLUB_ADMIN" &&
            event.club.toString() !== req.user.club.toString()
        ) {
            return res.status(403).json({
                message: "You can only update applications for your own club"
            });
        }

        // Update and save status
        application.status = status;
        await application.save();

        res.status(200).json({
            message: "Application status updated successfully",
            application
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
    getEventApplications,
    getMyApplications,
    updateApplicationStatus
};