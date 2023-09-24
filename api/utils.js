function requireUser(req, res, next) {
    if (!req.user) {
        res.status(401).send({
            message: "You must be logged in to perform this action",
            name: "UnauthorizedError",
            error: "You must be logged in to perform this action",
        });
    }
    next();
}

function requireAdmin(req, res, next) {
    if (!req.user.is_admin) {
        res.status(403).send({
            message: "You must be an admin to perform this action",
            name: "ForbiddenError",
            error: "You must be an admin to perform this function",
        });
    }
    next();
}

module.exports = {
    requireUser,
    requireAdmin,
};