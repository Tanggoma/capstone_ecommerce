const express = require('express');
const router = express.Router();

const {
    getAllUserPersonalInfo,
    getUserPersonalInfo,
    updateUserPersonalInfo,
    updateUserPassword
} = require('../db/personal_info');
const { requireUser } = require('../middleware/requireUser');



// GET - /api/personal-info - Get all user personal info
// router.get('/', async (req, res, next) => {
//     try {
//         const personalInfo = await getAllUserPersonalInfo();
//         res.json(personalInfo);
//     } catch (error) {
//         next(error);
//     }
// });

// GET - /api/personal-info - Get personal info for a single user by user ID
router.get('/', requireUser, async (req, res, next) => {
    // console.log('Entered /api/personal_info route');
    try {
        const userId = req.user.id;
        console.log('userId', userId)
        const personalInfo = await getUserPersonalInfo(userId);
        res.json(personalInfo);
    } catch (error) {
        next(error);
    }
});

// PATCH - /api/personal-info/:userId - Update personal info for a user by user ID
router.patch('/', requireUser, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updatedInfo = req.body;

        if (!updatedInfo || Object.keys(updatedInfo).length === 0) {
            return res.status(400).json({ message: 'No data provided for update' });
        }

        await updateUserPersonalInfo(userId, updatedInfo);
        res.json({ message: 'Personal info updated successfully' });
    } catch (error) {

        if (error.message === 'SomeSpecificErrorMessage') {
            return res.status(400).json({ message: 'A more user-friendly error message' });
        }

        next(error);
    }
});

// Post Password Update 
router.post('/update-password', requireUser, async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    try {
        const result = await updateUserPassword(userId, currentPassword, newPassword);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



module.exports = router;
