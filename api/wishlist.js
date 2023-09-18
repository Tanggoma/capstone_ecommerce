const express = require('express');
const router = express.Router();
const {
    getAllWishlistItems,
    getWishlistItemsByUser,
    addToWishlist,
    deleteWishlistItemByProduct,
    getWishlistItemByUserAndProduct
} = require('../db/wishlist');

const { requireUser, decodeSid } = require('../middleware/requireUser');

// GET - /api/wishlist - get all wishlist items
router.get('/', async (req, res, next) => {
    try {
        const wishlistItems = await getAllWishlistItems();
        res.send(wishlistItems);
    } catch (error) {
        next(error);
    }
});

// GET - /api/wishlist/:userId - get wishlist items for a specific user
router.get('/user', requireUser, decodeSid, async (req, res, next) => {
    try {

        let userId = null;
        if (req.user) {
            userId = req.user.id;
            console.log(userId)

        }

        // console.log(userId);
        const wishlistItems = await getWishlistItemsByUser(userId);
        res.json(wishlistItems);
    } catch (error) {
        next(error);
    }
});

router.delete('/user/product/:productId', requireUser, decodeSid, async (req, res) => {
    try {
        let userId = null;
        if (req.user) {
            userId = req.user.id;
            console.log(userId)

        }
        console.log("Attempting to delete wishlist item for user:", userId, "and product:", req.params.productId);
        const deletedItem = await deleteWishlistItemByProduct(userId, req.params.productId);
        res.json(deletedItem);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error deleting item from wishlist." });
    }
});


//POST 
router.post('/:productId', requireUser, decodeSid, async (req, res) => {
    try {

        const productId = req.params.productId

        let userId = null;
        if (req.user) {
            userId = req.user.id;
            console.log(userId)

        }

        const existingItem = await getWishlistItemByUserAndProduct(userId, productId);
        console.log(existingItem)
        if (existingItem) {
            throw new Error('Product is already in the wishlist');
        }

        await addToWishlist(userId, productId);

        res.json({ message: 'Product added to wishlist!' });
    } catch (error) {

        if (error.message.includes('Product is already in the wishlist')) {

            res.status(400).json({
                error: {
                    name: "Duplicate Item",
                    message: "Product is already in the wishlist!"
                }
            });
        } else {
            res.status(500).json({
                error: {
                    name: "Internal Server Error",
                    message: error.message
                }
            });
        }
    }
});




// router.delete('/', requireUser, decodeSid, async (req, res) => {

//     try {
//         let userId = null;
//         if (req.user) {
//             userId = req.user.id;
//             console.log(userId)

//         }


//     } catch (error) {

//     }


// })




module.exports = router;
// router.post('/', requireUser, async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { productId } = req.body;

//         await addToWishlist(userId, productId);

//         res.json({ message: 'Product added to wishlist!' });
//     } catch (error) {
//         res.status(500).json({
//             error: {
//                 name: "Internal Server Error",
//                 message: error.message
//             }
//         });
//     }
// });

// module.exports = router;


