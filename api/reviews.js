const express = require('express');
const router = express.Router();
const {
    getAllProductReviews,
    getProductReviews,
    createReview
} = require('../db/reviews');
const { requireUser, decodeSid } = require('../middleware/requireUser');


// GET - /api/reviews - get all reviews for all products
router.get('/', async (req, res, next) => {
    try {
        const reviews = await getAllProductReviews();
        res.send(reviews);
    } catch (error) {
        next(error);
    }
});

// GET - /api/reviews/:productId - get all reviews for a specific product
router.get('/:productId', async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const reviews = await getProductReviews(productId);
        res.send(reviews);
    } catch (error) {
        next(error);
    }
});

// POST - /api/reviews - create a new review
// router.post('/', async (req, res, next) => {
//     try {
//         const { userId, productId, rating, text } = req.body;
//         const newReview = await createReview(userId, productId, rating, text);
//         res.send(newReview);
//     } catch (error) {
//         next(error);
//     }
// });

// router.post('/:productId', requireUser, async (req, res, next) => {
//     try {
//         // const { rating, text } = req.body;
//         const userId = req.user.id;
//         console.log(typeof userId);
//         const productId = parseInt(req.params.productId, 10);
//         console.log(typeof productId);
//         const rating = req.body.rating;
//         console.log(typeof rating);
//         const text = req.body.text;
//         console.log(typeof text);

//         if (!rating || rating < 0 || rating > 5) {
//             return res.status(400).send({ error: "Rating must be between 0 and 5." });
//         }

//         const newReview = await createReview(userId, productId, rating, text);
//         res.status(201).json(newReview);
//     } catch (error) {
//         next(error);
//     }
// });

router.post('/:productId', requireUser, decodeSid, async (req, res, next) => {
    try {

        const productId = parseInt(req.params.productId, 10);
        const rating = req.body.rating;
        const text = req.body.text;

        if (!rating || rating < 0 || rating > 5) {
            return res.status(400).send({ error: "Rating must be between 0 and 5." });
        }

        console.log('req.user', req.user)
        let userId = null;
        if (req.user) {
            userId = req.user.id;
            console.log(userId)

        }

        console.log(userId)

        const newReview = await createReview(userId, productId, rating, text);
        res.status(201).json(newReview);

    } catch (error) {
        next(error);
    }
});

module.exports = router;
