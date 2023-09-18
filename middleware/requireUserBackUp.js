const jwt = require('jsonwebtoken');
// import jwt from 'jsonwebtoken';
const { JWT_SECRET = 'neverTell' } = process.env;

// function requireUser(req, res, next) {
//     // const token = req.header('Authorization');
//     const token = req.header('Authorization').split(' ')[1];
//     console.log("Token", token);

//     if (!token) {
//         return next({
//             name: "MissingTokenError",
//             message: "Token is missing"
//         });
//     }

//     try {
//         // Verify the token using the JWT_SECRET
//         // console.log("Verifying token with JWT_SECRET:", JWT_SECRET);
//         const decoded = jwt.verify(token, JWT_SECRET);
//         // console.log("Decoded token in requireUser:", decoded);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         next({
//             name: "InvalidTokenError",
//             message: "Invalid token ERRRRRRROORR"
//         });
//     }
// }

// second
function requireUser(req, res, next) {
    // Extract the token from the Authorization header
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
            // Verify the token using the JWT_SECRET
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;  // Attach the decoded user payload to the request object


        } catch (error) {
            // Invalid token. You can either throw an error or simply log it and continue
            return res.status(401).send({ message: "Invalid token." });
        }
    }
    next();
}






module.exports = {
    requireUser
};


// async function requireUser(req, res, next) {
//     const token = req.header('Authorization').split(' ')[1];
//     if (!token) {
//         return next({ name: "MissingTokenError", message: "Token is missing" });
//     }

//     try {
//         const decoded = jwt.verify(token, JWT_SECRET);
//         const userId = decoded.id;

//         // Assuming you have a function getUserById to fetch user details
//         const user = await getUserById(userId);

//         if (!user) {
//             return next({ name: "UserNotFoundError", message: "User not found" });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         next({ name: "InvalidTokenError", message: "Invalid token" });
//     }
// }


