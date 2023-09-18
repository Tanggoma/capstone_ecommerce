const client = require('./client');
// const util = require('util');

// GET - /api/products - get all products
async function getAllProducts() {
    try {
        const { rows } = await client.query(`
            SELECT * FROM products;
        `);
        return rows;
    } catch (err) {
        throw err;
    }
}

// GET - /api/products/:id - get a single product by id
async function getProductById(id) {
    try {
        const { rows: [product] } = await client.query(`
            SELECT * FROM products
            WHERE id = $1;
        `, [id]);
        return product;
    } catch (error) {
        throw error;
    }
}

// Add new product
// POST - /api/products/create - create a new product
async function createProduct(body) {

    const { title, brand, description, price, category_id, image_url, available_units } = body;

    try {
        const { rows: [product] } = await client.query(`
            INSERT INTO products(title,brand,"description",price,category_id,image_url,available_units)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `, [title, brand, description, price, category_id, image_url, available_units]);
        return product;
    } catch (error) {
        throw error;
    }
}


// PUT - /api/products/:id - update a single product by Id
async function updateProduct(productId, updates) {
    const { title, brand, description, price, category_id, image_url, available_units } = updates;

    try {
        const { rows: [product] } = await client.query(`
        UPDATE products
        SET title = $1, brand = $2, description = $3, price = $4, category_id = $5, image_url = $6, available_units = $7
        WHERE id = $8
        RETURNING *;
      `, [title, brand, description, price, category_id, image_url, available_units, productId]);

        return product;
    } catch (error) {
        throw error;
    }
}


// DELETE - /api/products/:id - delete a single product by id
async function deleteProduct(id) {
    try {
        const { rows: [product] } = await client.query(`
            DELETE FROM products
            WHERE id=$1
            RETURNING *;
        `, [id]);
        return product;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}