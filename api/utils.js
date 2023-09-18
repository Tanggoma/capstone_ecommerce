// function requireUser(req, res, next) {
//     if (!req.user) {
//         return next({
//             name: "MissingUserError",
//             message: "You must be logged in to perform this action"
//         });
//     }

//     next();
// }

// const requiredNotSent = ({ requiredParams, atLeastOne = false }) => {
//     return (req, res, next) => {
//         if (atLeastOne) {
//             let numParamsFound = 0;
//             for (let param of requiredParams) {
//                 if (req.body[param] !== undefined) {
//                     numParamsFound++;
//                 }
//             }
//             if (!numParamsFound) {
//                 return next({
//                     name: 'MissingParams',
//                     message: `Must provide at least one of these in the body: ${requiredParams.join(', ')}`
//                 });
//             }
//         } else {
//             const notSent = requiredParams.filter(param => req.body[param] === undefined);
//             if (notSent.length) {
//                 return next({
//                     name: 'MissingParams',
//                     message: `Required parameters not sent in the body: ${notSent.join(', ')}`
//                 });
//             }
//         }

//         next();
//     };
// };

// module.exports = {
//     requireUser,
//     requiredNotSent,
// };
