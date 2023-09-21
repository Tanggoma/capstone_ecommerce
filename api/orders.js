const express = require('express');
const router = express.Router();

const { requireUser } = require("../middleware/requireUser");

const {
    getAllOrderHistory,
    postAllOrderHistory
} = require('../db/orders'); // Import  orders functions

// get orders history

router.get('/', requireUser, async (req, res) => {
    const userId = req.user.id;

    try {
        const orderHistory = await getAllOrderHistory(userId)
        res.status(200).send(orderHistory);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching order history', error: error.message })
    }
});

// add orders history 
router.post('/history', requireUser, async (req, res) => {

    const userId = req.user.id;
    const { itemForOrders, totalAmount } = req.body;

    const result = await postAllOrderHistory(userId, itemForOrders, totalAmount);

    res.status(result.status).send({ message: result.message, error: result.error });
});

module.exports = router;