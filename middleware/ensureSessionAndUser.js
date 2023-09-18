const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'neverTell' } = process.env;

function ensureSessionAndUser(req, res, next) {
    // If a session ID doesn't exist, express-session will create one
    if (!req.sessionID) {
        return next({
            name: "SessionError",
            message: "Session could not be created"
        });
    }

    // If JWT token exists, decode it and attach user to request
    const authHeader = req.header('Authorization');
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (!token) {
            return next({
                name: "InvalidHeaderFormatError",
                message: "Authorization header format should be 'Bearer YOUR_TOKEN_HERE'"
            });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;  // Attach the decoded user payload to the request object
        } catch (error) {
            // Invalid token. You can either throw an error or simply log it and continue
            console.error("Invalid token:", error);
        }
    }
    next();
}

module.exports = {
    ensureSessionAndUser
};
