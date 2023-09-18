const express = require('express');
const router = express.Router();
const { getProductsByCategory, getAllCategories } = require('../db/categories');

//GET all categories -  /api/category

router.get('/', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({
            error: {
                name: "Internal Server Error",
                message: error.message
            }
        });
    }
});


// GET - /api/category/:categoryId - get products by category
router.get('/:categoryId', async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await getProductsByCategory(categoryId);
        res.json(products);
    } catch (error) {
        res.status(500).json({
            error: {
                name: "Internal Server Error",
                message: error.message
            }
        });
    }
});

module.exports = router;
