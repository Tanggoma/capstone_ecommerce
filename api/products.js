const express = require('express');
const router = express.Router();
const path = require('path');

const
    {
        getAllProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct
    } = require('../db/products');

// const { requireUser, decodeSid } = require('../middleware/requireUser');
const { userOrGuest, decodeSid, requireUser } = require(path.join(__dirname, 'middleware', 'requireUser.js'));

//checked**
// GET - /api/products - get all products
router.get('/', async (req, res, next) => {
    try {
        const products = await getAllProducts();
        res.send(products);
    } catch (error) {
        next(error);
    }
});

//checked**
// GET - /api/products/:id - get a single product by id

router.get('/:id', async (req, res, next) => {
    try {
        const product = await getProductById(req.params.id);
        res.send(product);
    } catch (error) {
        next(error);
    }
});

//checked** >> just add requireUser middleware >> check again 
// POST - /api/products - create a new product
router.post('/create', requireUser, async (req, res, next) => {
    try {

        const product = await createProduct(req.body);
        res.send(product);
    } catch (error) {
        console.log(req.body)
        console.error("Error in createProduct:", error);
        next(error);
    }
});

//checked**
/// PUT - /api/products/:id - update a product
router.put('/:id', requireUser, async (req, res, next) => {
    try {
        const productId = req.params.id;
        const updatedProduct = await updateProduct(productId, req.body);
        res.send(updatedProduct);
    } catch (error) {
        next(error);
    }
});

//checked**
// DELETE - /api/products/:id - delete a product
router.delete('/:id', requireUser, async (req, res, next) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await deleteProduct(productId);
        res.send(deletedProduct);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
