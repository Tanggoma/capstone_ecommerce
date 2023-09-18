const client = require('./client');

// Get all wishlist items
async function getAllWishlistItems() {
    try {
        const { rows: wishlistItems } = await client.query(`
            SELECT * FROM wishlist;
        `);

        return wishlistItems;
    } catch (error) {
        throw error;
    }
}

// get wishlist item by userID

async function getWishlistItemsByUser(userId) {
    try {
        const { rows: wishlistItems } = await client.query(`
            SELECT w.id AS wishlist_id,
                   p.id AS product_id, p.title AS product_title,
                   p.brand AS product_brand, p.price AS product_price,
                   w.quantity AS wishlist_quantity
            FROM wishlist AS w
            JOIN products AS p ON w.product_id = p.id
            WHERE w.user_id = $1;
        `, [userId]);

        return wishlistItems;
    } catch (error) {
        throw error;
    }
}

async function getWishlistItemByUserAndProduct(userId, productId) {
    try {
        const { rows: [item] } = await client.query(`
            SELECT * FROM wishlist
            WHERE user_id = $1 AND product_id = $2
        `, [userId, productId]);
        return item;
    } catch (error) {
        throw error;
    }
}

async function addToWishlist(userId, productId, quantity = 1) {
    try {
        const { rows: [wishlistItem] } = await client.query(`
            INSERT INTO wishlist (user_id, product_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [userId, productId, quantity]);

        return wishlistItem;
    } catch (error) {
        throw error;
    }
}

// async function addToWishlist(userId, productId) {
//     try {
//         // check if the item is already in the wishlist
//         const { rows: [existingItem] } = await client.query(`
//             SELECT * FROM wishlist
//             WHERE user_id = $1 AND product_id = $2
//         `, [userId, productId]);

//         if (existingItem) {
//             throw new Error('Product is already in the wishlist!');
//         }

//         // If not, add the item to the wishlist
//         const { rows: [wishlistItem] } = await client.query(`
//             INSERT INTO wishlist (user_id, product_id, quantity =1)
//             VALUES ($1, $2, $3)
//             RETURNING *;
//         `, [userId, productId, quantity]);

//         return wishlistItem;
//     } catch (error) {
//         throw error;
//     }
// }


async function deleteWishlistItemByProduct(userId, productId) {
    try {
        const { rows: [deletedItem] } = await client.query(`
            DELETE FROM wishlist
            WHERE user_id = $1 AND product_id = $2
            RETURNING *;
        `, [userId, productId]);

        return deletedItem;
    } catch (error) {
        throw error;
    }
}




module.exports = {
    getAllWishlistItems,
    getWishlistItemsByUser,
    getWishlistItemByUserAndProduct,
    addToWishlist,
    deleteWishlistItemByProduct
};