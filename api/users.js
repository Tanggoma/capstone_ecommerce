const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { createUser, getUser, getUserById, getUserByUsername, getAllUsers, updateUser } = require('../db/users');
// const { requireUser } = require('./utils');
const { requireUser } = require('../middleware/requireUser');
// const { decodeUser } = require('../middleware/requireUser');
const { JWT_SECRET = 'neverTell' } = process.env;




// CHECKED**
// GET /api/users - Get all users
router.get('/', async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        next(error);
    }
});

// CHECKED**
// GET /api/users/:id - Get user by ID  
router.get('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await getUserById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(user);
        }
    } catch (error) {
        next(error);
    }
});

// CHECKED**
// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        next({
            name: 'MissingCredentialsError',
            message: 'Please supply both a username and password'
        });
    }

    try {
        const user = await getUser(username, password);
        if (!user) {
            res.status(401);
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect',
            })
        } else {
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
            console.log('Generated token:', token);
            res.send({ user, message: "you're logged in!", token });
        }
    } catch (error) {
        next(error);
    }
});

// CHECKED**
// POST /api/users/register
router.post('/register', async (req, res, next) => {
    try {
        const { username, email, password, first_name, last_name, address_city, address_street, address_zipcode, phone_number } = req.body;

        // Check if username already exists
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(401).json({
                error: 'UserExistsError',
                message: 'A user by that username already exists'
            });
        }

        // Create a new user
        const newUser = await createUser({
            username,
            email,
            password,
            first_name,
            last_name,
            address_city,
            address_street,
            address_zipcode,
            phone_number
        });

        // Generate a token for the new user
        const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET);

        res.status(201).json({
            user: newUser,
            message: "You're signed up!",
            token
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/users/me
router.get('/me', requireUser, async (req, res, next) => {
    try {
        res.send(req.user);
    } catch (error) {
        next(error)
    }
})

// CHECKED**
// PUT /api/users/:id - Update user information
router.put('/:id', requireUser, async (req, res, next) => {
    try {

        // const token = req.header('Authorization').split(' ')[1];

        // Verify the token using the JWT_SECRET
        // const decoded = jwt.verify(token, JWT_SECRET);
        // console.log("Decoded token in update user route:", decoded);

        const userId = req.params.id;
        const updatedUserInfo = req.body;
        const updatedUser = await updateUser(userId, updatedUserInfo);

        res.send(updatedUser);
    } catch (error) {
        next(error);
    }
});



module.exports = router;
