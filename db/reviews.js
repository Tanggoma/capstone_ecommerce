const client = require('./client');

// Get all reviews for all products

// async function getAllProductReviews() {
//     try {
//         const { rows: reviews } = await client.query(`
//             SELECT r.id AS review_id, r.user_id, u.username, r.product_id, p.title AS product_title, r.rating, r.text, r.created_at
//             FROM reviews AS r
//             JOIN users AS u ON r.user_id = u.id
//             JOIN products AS p ON r.product_id = p.id;
//         `);

//         return reviews;
//     } catch (error) {
//         throw error;
//     }
// }

async function getAllProductReviews() {
    try {
        const { rows } = await client.query(`
            SELECT * FROM reviews;
        `);

        return rows;
    } catch (error) {
        throw error;
    }
}



// Get all reviews for a product by product ID
// async function getProductReviews(productId) {
//     try {
//         const { rows: reviews } = await client.query(`
//         SELECT r.id AS review_id, r.user_id, u.username, r.product_id, p.title AS product_title, r.rating, r.text, r.created_at
//         FROM reviews AS r
//         JOIN users AS u ON r.user_id = u.id
//         JOIN products AS p ON r.product_id = p.id
//         WHERE r.product_id = $1;
//         `, [productId]);

//         return reviews;
//     } catch (error) {
//         throw error;
//     }
// }


async function getProductReviews(productId) {
    try {
        const { rows: reviews } = await client.query(`
        SELECT 
    r.id AS review_id, 
    r.user_id, 
    COALESCE(u.username, 'Guest') AS username, 
    r.product_id, 
    p.title AS product_title, 
    r.rating, 
    r.text, 
    r.created_at
FROM reviews AS r
LEFT JOIN users AS u ON r.user_id = u.id
JOIN products AS p ON r.product_id = p.id
WHERE r.product_id = $1;

        `, [productId]);

        return reviews;
    } catch (error) {
        throw error;
    }
}





// POST - /api/reviews - create a new review
async function createReview(userId, productId, rating, text) {
    try {
        const { rows: [newReview] } = await client.query(`
            INSERT INTO reviews (user_id, product_id, rating, text)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [userId, productId, rating, text]);

        return newReview;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllProductReviews,
    getProductReviews,
    createReview
};



