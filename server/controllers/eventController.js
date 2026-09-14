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

module.exports = {
    createEvent
};