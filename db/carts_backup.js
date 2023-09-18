const client = require('./client');
// const util = require('util');



// get user cart
// Add new cart
// Update a cart
// Delete a cart


// Get all carts
async function getAllCarts() {
    try {
        const { rows: carts } = await client.query('SELECT * FROM carts');
        return carts;
    } catch (error) {
        throw error;
    }
}


async function getAllCartItems(userId) {
    try {
        const { rows } = await client.query(`
            SELECT * FROM carts WHERE user_id = $1;
        `, [userId]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getAllCartItemsForSession(sessionId) {
    try {
        const { rows } = await client.query(`
            SELECT * FROM carts
            WHERE session_id = $1;
        `, [sessionId]);
        return rows;
    } catch (error) {
        throw error;
    }
}


// Get a single cart by ID
async function getCartById(id) {
    try {
        const { rows: [cart] } = await client.query('SELECT * FROM carts WHERE id = $1', [id]);

        const productsQuery = await client.query(`
        SELECT product_id, quantity
        FROM carts
        WHERE id = $1;
    `, [id]);

        const productsArray = productsQuery.rows.map(row => ({
            productId: row.product_id,
            quantity: row.quantity
        }));

        // Combine cart data with product data
        const cartWithProducts = {
            ...cart,
            products: productsArray
        };

        return cartWithProducts;

    } catch (error) {
        throw error;
    }
}



// Get user's carts with product details
async function getUserCartsWithProductDetails(userId) {
    try {
        const { rows: carts } = await client.query(`
            SELECT c.id AS cart_id, c.quantity AS cart_quantity,
                   p.id AS product_id, p.title AS product_title,
                   p.brand AS product_brand, p.price AS product_price
            FROM carts AS c
            JOIN products AS p ON c.product_id = p.id
            WHERE c.user_id = $1;
        `, [userId]);

        return carts;
    } catch (error) {
        throw error;
    }
}

// Add a new cart
// async function addCart(userId, productId, quantity) {
//     try {
//         await client.query(`
//             INSERT INTO carts (user_id, product_id, quantity, created_at)
//             VALUES ($1, $2, $3, CURRENT_TIMESTAMP);
//         `, [userId, productId, quantity]);

//         const { rows: [newCart] } = await client.query(`
//             SELECT * FROM carts
//             WHERE user_id = $1 AND product_id = $2;
//         `, [userId, productId]);

//         return newCart;
//     } catch (error) {
//         throw error;
//     }
// }


async function addToCart(userId, productId, quantity, sessionId) {
    try {
        const { rows } = await client.query(`
            INSERT INTO carts (user_id, product_id, quantity, created_at,session_id)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
            RETURNING *;
        `, [userId, productId, quantity, sessionId]);
        return rows[0];
    } catch (error) {
        throw error;
    }
}



// Add to cart function 
// async function addToCart(userId, productId, quantity, sessionId) {
//     try {
//         // First, check if the product already exists in the cart for the user or guest
//         const { rows: existingProduct } = await client.query(`
//             SELECT * FROM carts 
//             WHERE (user_id = $1 OR session_id = $2) AND product_id = $3;
//         `, [userId, sessionId, productId]);

//         if (existingProduct.length > 0) {
//             // If the product exists, update the quantity
//             const newQuantity = existingProduct[0].quantity + quantity;
//             const { rows: updatedProduct } = await client.query(`
//                 UPDATE carts
//                 SET quantity = $1
//                 WHERE id = $2
//                 RETURNING *;
//             `, [newQuantity, existingProduct[0].id]);
//             return updatedProduct[0];
//         } else {
//             // If the product doesn't exist in the cart, insert a new row
//             const { rows: newProduct } = await client.query(`
//                 INSERT INTO carts (user_id, product_id, quantity, created_at, session_id)
//                 VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
//                 RETURNING *;
//             `, [userId, productId, quantity, sessionId]);
//             return newProduct[0];
//         }
//     } catch (error) {
//         throw error;
//     }
// }




// Update a cart
// async function updateCart(userId, productId, newProductId, newQuantity) {
//     try {
//         await client.query(`
//             UPDATE carts
//             SET product_id = $3, quantity = $4
//             WHERE user_id = $1 AND product_id = $2;
//         `, [userId, productId, newProductId, newQuantity]);

//         const { rows: [updatedCart] } = await client.query(`
//             SELECT * FROM carts
//             WHERE user_id = $1 AND product_id = $3;
//         `, [userId, newProductId]);

//         return updatedCart;
//     } catch (error) {
//         throw error;
//     }
// }

//checked**
async function updateCart(userId, productId, newProductId, newQuantity, sessionId) {
    try {
        if (userId) {
            await client.query(`
                UPDATE carts
                SET product_id = $3, quantity = $4
                WHERE user_id = $1 AND product_id = $2;
            `, [userId, productId, newProductId, newQuantity]);
        } else if (sessionId) {
            await client.query(`
                UPDATE carts
                SET product_id = $3, quantity = $4
                WHERE session_id = $1 AND product_id = $2;
            `, [sessionId, productId, newProductId, newQuantity]);
        } else {
            throw new Error("Both userId and sessionId cannot be absent.");
        }

        const criteria = userId ? `user_id = $1` : `session_id = $1`;
        const value = userId || sessionId;

        const { rows: [updatedCart] } = await client.query(`
            SELECT * FROM carts
            WHERE ${criteria} AND product_id = $2;
        `, [value, newProductId]);

        return updatedCart;
    } catch (error) {
        throw error;
    }
}






// Delete a cart

async function deleteCart(cartId) {
    try {
        const result = await client.query(`
            DELETE FROM carts
            WHERE id = $1
        `, [cartId]);
        return result;
    } catch (error) {
        throw error;
    }
}

// delete product from cart 

async function deleteProductFromCart(userId, productId, sessionId) {
    try {
        let query = 'DELETE FROM carts WHERE product_id = $1';
        const values = [productId];

        if (userId) {
            query += ' AND user_id = $2';
            values.push(userId);
        } else {

            query += ' AND session_id = $2';
            values.push(sessionId);
        }

        // console.log('Executing query:', query, 'with values:', values);


        const result = await client.query(query, values);

        return result.rowCount > 0;
    } catch (error) {
        console.error('Error deleting product from cart:', error.message);
        throw error;
    }
}
// FUNCTION to clear cart after payment 
// async function clearCart(userId, sessionId) {
//     if (userId) {

//         await client.query('DELETE FROM carts WHERE user_id = $1', [userId]);
//     } else if(sessionId) {
//         await client.query('DELETE FROM carts WHERE session_id = $1', [sessionId]);
//     }
// }



module.exports = {
    getAllCarts,
    getAllCartItems,
    getAllCartItemsForSession,
    getCartById,
    getUserCartsWithProductDetails,
    addToCart,
    updateCart,
    deleteCart,
    deleteProductFromCart,
    // clearCart
};
