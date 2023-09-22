const express = require('express');
const router = express.Router();

const {
    getAllCarts,
    getAllCartItems,
    getAllCartItemsForSession,
    getCartById,
    getUserCartsWithProductDetails,
    addToCart,
    updateCart,
    deleteCart,
    deleteProductFromCart,
    clearCart
} = require('../db/carts'); // Import  cart functions

const { userOrGuest, requireUser, decodeSid } = require('../middleware/requireUser')




//check**
// GET - /api/carts - Get all carts
router.get('/', async (req, res, next) => {
    try {
        const carts = await getAllCarts();
        res.json(carts);
    } catch (error) {
        next(error);
    }
});

//check**
// GET - /api/carts/mycart - Get carts with product details by user ID
router.get('/mycart', requireUser, async (req, res, next) => {
    // Grab the user ID from the attached user object
    const userId = req.user.id;
    console.log('userId', userId)

    try {
        const carts = await getUserCartsWithProductDetails(userId);
        res.json(carts);
    } catch (error) {
        next(error);
    }
});

// Version2
router.get('/session', async (req, res, next) => {
    try {

        // const sessionId = req.sessionID
        const sessionId = req.decodedSid; // req.decodeSid?!? 

        console.log('sessionId', sessionId)

        const cartItems = await getAllCartItemsForSession(sessionId);
        res.json(cartItems);

    } catch (error) {

        next(error);
    }
});

//check**
// GET - /api/carts/:id - Get a single cart by ID
router.get('/:id', async (req, res, next) => {
    try {
        const cart = await getCartById(req.params.id);
        res.json(cart);

    } catch (error) {
        next(error);
    }
});

// POST -  - Add a new cart

router.post('/', requireUser, async (req, res) => {
    const product = req.body;

    if (!product || !product.product_id || !product.quantity) {
        return res.status(400).send({ error: 'Invalid product data.' });
    }

    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
    }

    // const userId = req.user.id || null;
    // const userId = req.user.id || null; // this is the correct one 

    const userId = req.user?.id || product.user_id || null;

    console.log("userId from cart route", userId)

    // const sessionId = req.cookies.sessionId || product.session_id || null;
    const sessionId = userId ? null : req.sessionID;
    console.log("sessionId from cart route post", sessionId)
    console.log("Express sessionID:", req.sessionID); // added for dev


    try {
        await addToCart(userId, product.product_id, product.quantity, sessionId);

        // Retrieve all cart items for the user/guest
        let updatedCartItems = [];
        if (userId) {
            updatedCartItems = await getAllCartItems(userId);
        } else if (sessionId) {
            updatedCartItems = await getAllCartItemsForSession(sessionId);
        }


        if (updatedCartItems.length === 0) {
            // return res.status(404).send({ message: "No items found in the cart." });
            return res.status(200).send({ message: "Cart is empty." });
        }

        res.status(200).send({
            message: 'Product added to cart successfully!',
            updatedCart: updatedCartItems
        });
    } catch (error) {
        res.status(500).send({ error: 'Failed to add product to cart', details: error.message });
    }
});


// PUT - /api/carts/:id - Update a cart
// router.put('/:id', async (req, res, next) => {
//     try {
//         const cartId = parseInt(req.params.id);
//         const { userId, productId, newProductId, newQuantity } = req.body;
//         const updatedCart = await updateCart(userId, productId, newProductId, newQuantity);
//         res.json(updatedCart);
//     } catch (error) {
//         next(error);
//     }
// });


// router.put('/update', async (req, res, next) => {
//     try {
//         const { userId, productId, newProductId, newQuantity, sessionId } = req.body;

//         if (!userId && !sessionId) {
//             return res.status(400).json({
//                 error: {
//                     name: "Error",
//                     message: "Both userId and sessionId cannot be absent."
//                 }
//             });
//         }

//         const updatedCart = await updateCart(userId, productId, newProductId, newQuantity, sessionId);

//         res.json(updatedCart);
//     } catch (error) {
//         next(error);
//     }
// });

//checked**
// update cart 
router.put('/update', requireUser, async (req, res, next) => {
    const { productId, newQuantity } = req.body;

    const userId = req.user?.id
    const sessionId = userId ? null : req.sessionID;

    // Validate the data before updating
    if (!userId && !sessionId) {
        return res.status(400).json({ error: 'You must provide either userId or sessionId.' });
    }
    if (!productId || typeof newQuantity === 'undefined') {
        return res.status(400).json({ error: 'You must provide productId and newQuantity.' });
    }

    try {
        const updatedCart = await updateCart(userId, productId, newQuantity, sessionId);

        if (!updatedCart) {
            return res.status(404).json({ error: 'You did not provide a valid cart item.' });
        }

        return res.json(updatedCart);
    } catch (error) {
        next(error);
    }
});


// DELETE - /api/carts/:id - Delete a cart
// router.delete('/:id', async (req, res, next) => {
//     try {
//         const cartId = parseInt(req.params.id);
//         await deleteCart(cartId);
//         res.json({ message: 'Cart deleted successfully' });
//     } catch (error) {
//         next(error);
//     }
// });

//DELETE BY PRODUCT ID 
router.delete('/delete', async (req, res, next) => {

    // const { userId, productId, sessionId } = req.query;

    const userId = req.user && req.user.id;
    const { productId, sessionId } = req.query;


    console.log('userId', userId)
    console.log('sessionId', sessionId)

    // Validate the data before deleting
    if (!productId) {
        return res.status(400).json({ error: 'You must provide a productId.' });
    }

    if (!userId && !sessionId) {
        return res.status(400).json({ error: 'You must provide either userId or sessionId.' });
    }

    try {
        const deleted = await deleteProductFromCart(userId, productId, sessionId);

        if (!deleted) {
            return res.status(404).json({ error: 'Product not found in the cart for the provided user/session.' });
        }

        return res.json({ message: 'Product removed from cart successfully.' });
    } catch (error) {
        next(error);
    }
});

// CLEAR CART by user or guest after payment 
router.delete('/clear', async (req, res, next) => {

    console.log('Clear cart route hit with request:', req.body);

    const userIdFromReq = req.body.userId;
    const sessionIdFromReq = req.body.sessionId;

    // const userId = req.user && req.user.id 
    const userId = req.user ? req.user.id : userIdFromReq

    console.log('userId', userId);
    // const sessionId = req.decodeSid
    const sessionId = req.decodeSid || sessionIdFromReq;

    console.log('seesionId', sessionId)
    // const sessionId = req.sessionID;

    console.log(`Processing clear cart for userId: ${userId} and sessionId: ${sessionId}`);  // log details

    if (!userId && !sessionId) {
        console.error('Either userId or sessionId is missing');
        return res.status(400).json({ error: 'You must provide either userId or sessionId.' });
    }

    try {
        const result = await clearCart(userId, sessionId);

        if (result.success) {
            res.status(200).json({ message: result.message });

        } else {
            throw new Error(result.message); // Propagate the error to the catch block
        }
    } catch (error) {
        console.error('Error encountered while clearing cart:', error);
        next(error);
    }
});

router.delete('/:cartId', async (req, res, next) => {
    try {
        const { cartId } = req.params;

        if (!cartId) {
            return res.status(400).json({
                error: {
                    name: "ValidationError",
                    message: "Cart ID must be provided."
                }
            });
        }

        const result = await deleteCart(cartId);
        if (result.rowCount === 0) {
            return res.status(404).json({
                error: {
                    name: "NotFound",
                    message: "Cart not found."
                }
            });
        }

        res.json({
            message: 'Cart deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
});








module.exports = router;
