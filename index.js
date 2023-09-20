const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
const signature = require('cookie-signature');
const path = require('path');

// const { userOrGuest, decodeSid, requireUser } = require('../capstone_ecommerce/middleware/requireUser') // For Local
const { userOrGuest, decodeSid, requireUser } = require('./middleware/requireUser')


// Middleware
app.use(express.static(path.join(__dirname, 'dist'))); //add >> For Deployment 
app.use(morgan('dev'));
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:5174', // frontend's address LOCAL
    // origin: 'https://scuba-commerce-ef8c050498e9.herokuapp.com', // frontend's address DEPLOY
    credentials: true, // to use cookies or authentication
    allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id', 'credentials']
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true, //was false
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }, // Set secure to true later for deploy using https. For local development, use false.
    genid: (req) => {
        return uuidv4(); // Use UUIDs for session IDs
    }
}));

app.get('/get-decoded-session-id', userOrGuest, requireUser, decodeSid, (req, res) => {
    console.log(req.session);
    res.send({
        decodedSessionId: req.decodedSid,
        decodedUser: req.user
    });
});


// Import and use routes
const usersRouter = require('./api/users');
const productsRouter = require('./api/products');
const cartsRouter = require('./api/carts');
const categoriesRouter = require('./api/categories');
const wishlistRouter = require('./api/wishlist');
const reviewsRouter = require('./api/reviews');
const personalInfoRouter = require('./api/personal_info')


app.use('/api/users', usersRouter);
app.use('/api/products', requireUser, decodeSid, productsRouter);
app.use('/api/carts', requireUser, decodeSid, cartsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/personal_info', personalInfoRouter);

// app.get('/get-decoded-session-id', userOrGuest, requireUser, decodeSid, (req, res) => {
//     console.log(req.session);
//     res.send({
//         decodedSessionId: req.decodedSid,
//         decodedUser: req.user
//     });
// });


// for deployment
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err.name === 'IncorrectCredentialsError') {
        res.status(401); // Unauthorized
    } else if (err.name === 'MissingCredentialsError') {
        res.status(400); // Bad Request
    } else {
        res.status(500); // Internal Server Error for other unhandled errors
    }
    res.json({ error: { name: err.name, message: err.message } });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
