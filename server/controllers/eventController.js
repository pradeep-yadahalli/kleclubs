const Event = require("../models/Event");
const Club = require("../models/Club");

// Create Event
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            type,
            banner,
            clubId,
            date,
            startTime,
            endTime,
            venue,
            registrationStart,
            registrationEnd,
            capacity,
            eligibility,
            rules,
            contactInformation
        } = req.body;

        if (
            !title ||
            !description ||
            !category ||
            !type ||
            !clubId ||
            !date ||
            !startTime ||
            !endTime ||
            !venue ||
            !registrationStart ||
            !registrationEnd ||
            !capacity
        ) {
            return res.status(400).json({
                message: "Required fields are missing"
            });
        }

        const club = await Club.findById(clubId);

        if (!club) {
            return res.status(404).json({
                message: "Club not found"
            });
        }

        const event = await Event.create({
            title,
            description,
            category,
            type,
            banner: banner || "",
            club: clubId,
            createdBy: req.user._id,
            date,
            startTime,
            endTime,
            venue,
            registrationStart,
            registrationEnd,
            capacity,
            eligibility: eligibility || "",
            rules: rules || "",
            contactInformation: contactInformation || ""
        });

        res.status(201).json({
            message: "Event created successfully",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//get all events
const getAllEvents = async (req, res) => {
    try {
        const { search, category, type, status } = req.query;

        const filter = {
            status: { $ne: "CANCELLED" }
        };

        // Search by event title or description
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // Filter by category
        if (category) {
            filter.category = category.toUpperCase();
        }

        // Filter by event type
        if (type) {
            filter.type = type.toUpperCase();
        }

        // Filter by status
        if (status) {
            filter.status = status.toUpperCase();
        }

        const events = await Event.find(filter)
            .populate("club", "name logo")
            .sort({ date: 1 });

        res.json({
            message: "Events fetched successfully",
            count: events.length,
            filters: {
                search: search || null,
                category: category || null,
                type: type || null,
                status: status || null
            },
            events
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get Single Event
const getEventById = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId)
            .populate("club", "name logo");

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        if (event.status === "CANCELLED") {
            return res.status(404).json({
                message: "Event is no longer available"
            });
        }

        res.json({
            message: "Event fetched successfully",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Event
const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        // Club admin can update only their own club's event
        if (
            req.user.role === "CLUB_ADMIN" &&
            event.club.toString() !== req.user.club.toString()
        ) {
            return res.status(403).json({
                message: "You can only update events of your own club"
            });
        }

        const allowedFields = [
            "title",
            "description",
            "category",
            "type",
            "banner",
            "date",
            "startTime",
            "endTime",
            "venue",
            "registrationStart",
            "registrationEnd",
            "capacity",
            "eligibility",
            "rules",
            "contactInformation"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                event[field] = req.body[field];
            }
        });

        await event.save();

        res.json({
            message: "Event updated successfully",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Cancel Event
const cancelEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        // Club admin can cancel only their own club's event
        if (
            req.user.role === "CLUB_ADMIN" &&
            event.club.toString() !== req.user.club.toString()
        ) {
            return res.status(403).json({
                message: "You can only cancel events of your own club"
            });
        }

        if (event.status === "CANCELLED") {
            return res.status(400).json({
                message: "Event is already cancelled"
            });
        }

        event.status = "CANCELLED";

        await event.save();

        res.json({
            message: "Event cancelled successfully",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    cancelEvent
};