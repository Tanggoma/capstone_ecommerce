const client = require('./client');

// get all orders history from user 
async function getAllOrderHistory(userId) {
    try {
        const { rows } = await client.query(`
            SELECT 
            orders.id AS orders_id,
            orders.total_amount,
            orders.order_date,
            order_items.product_id,
            order_items.quantity,
            order_items.price

            FROM 
            orders
            JOIN
            order_items ON orders.id = order_items.order_id
            WHERE 
            orders.user_id =$1
            ORDER BY
            orders.id, order_items.id;
        `, [userId]);

        const ordersMap = {};

        for (let row of rows) {

            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {

                    id: row.order_id,
                    total_amount: row.total_amount,
                    order_date: row.order_date,
                    items: []
                };
            }

            ordersMap[row.order_id].items.push({
                product_id: row.product_id,
                quantity: row.quantity,
                price: row.price
            });
        }
        return Object.values(ordersMap);
    } catch (error) {
        throw error;
    }
}
// post all orders history from user

async function postAllOrderHistory(userId, cartItems, totalAmount) {

    try {
        await client.query('BEGIN');

        const { rows } = await client.query(`
            INSERT INTO orders (user_id, total_amount)
            VALUES ($1, $2)
            RETURNING id;
        `, [userId, totalAmount]);

        const orderId = rows[0].id;

        for (let item of cartItems) {
            await client.query(`
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES ($1, $2, $3, $4);
            `, [orderId, item.id, item.quantity, item.price]);
        }

        await client.query('COMMIT');

        return { status: 200, message: 'Order placed successfully!' };


    } catch (error) {
        await client.query('ROLLBACK');
        return { status: 500, message: 'Error processing order!', error: error.message };
    }
}




module.exports = {
    getAllOrderHistory,
    postAllOrderHistory
};