const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'neverTell' } = process.env;
const signature = require('cookie-signature');

function userOrGuest(req, res, next) {
    const token = req.headers['Authorization'] ? req.headers['Authorization'].replace('Bearer ', '') : null;

    console.log('token', token);

    if (token) {
        // If there's a token, use requireUser middleware
        return requireUser(req, res, next);
    } else {
        // If no token, use decodeSid middleware
        return decodeSid(req, res, next);
    }
}

function requireUser(req, res, next) {

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
            req.user = decoded;

            console.log('decoded', decoded);

        } catch (error) {

            return res.status(401).send({ message: "Invalid token." });
        }
    }

    next();
}

function decodeSid(req, res, next) {
    const rawSid = req.cookies['connect.sid'];
    console.log('Raw SID:', rawSid);

    if (!rawSid) {
        return res.status(400).send('No session ID found.');
    }

    if (!rawSid.startsWith('s:')) {
        return res.status(400).send('Invalid session ID format.');
    }

    // Strip the signature and decode connect.sid
    const sid = rawSid.slice(2);
    const decodedSid = signature.unsign(sid, 'secret-key');



    if (decodedSid === false) {
        return res.status(400).send('Failed to decode session ID.');
    }

    req.decodedSid = decodedSid;
    next();
}

module.exports = {
    userOrGuest,
    requireUser,
    decodeSid
};




