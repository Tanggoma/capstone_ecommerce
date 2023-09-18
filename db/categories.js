const client = require('./client');
const util = require('util');

// Get all categories

async function getAllCategories() {
    try {
        const { rows } = await client.query(`
            SELECT * FROM categories;
        `);
        return rows;
    } catch (err) {
        throw err;
    }
}

// Get product bycategory

async function getProductsByCategory(categoryId) {
    try {
        const { rows: products } = await client.query(`
            SELECT * FROM products
            WHERE category_id = $1;
        `, [categoryId]);
        return products;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllCategories,
    getProductsByCategory
};