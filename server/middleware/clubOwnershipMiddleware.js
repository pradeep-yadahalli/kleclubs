const clubOwnership = (req, res, next) => {
    try {
        // Super Admin can access all clubs
        if (req.user.role === "SUPER_ADMIN") {
            return next();
        }

        // Club Admin must have a club assigned
        if (!req.user.club) {
            return res.status(403).json({
                message: "You are not assigned to any club"
            });
        }

        // Get club ID from request
        const requestedClubId =
            req.body.clubId ||
            req.params.clubId ||
            req.query.clubId;

        if (!requestedClubId) {
            return res.status(400).json({
                message: "Club ID is required"
            });
        }

        // Check ownership
        if (req.user.club.toString() !== requestedClubId.toString()) {
            return res.status(403).json({
                message: "You can only manage your own club"
            });
        }

        next();

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = clubOwnership;