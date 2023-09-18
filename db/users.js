const client = require('./client');
const bcrypt = require('bcrypt');
const SALT_COUNT = 6;

// Create a new user
async function createUser({ username, email, password, first_name, last_name, address_city, address_street, address_zipcode, phone_number, role }) {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    try {
        const { rows: [user] } = await client.query(`
        INSERT INTO users(username, email, password, first_name, last_name, address_city, address_street, address_zipcode, phone_number, role, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'user', CURRENT_TIMESTAMP)
        ON CONFLICT (username) DO NOTHING 
        RETURNING id, username;
        `, [
            username,
            email,
            hashedPassword,
            first_name,
            last_name,
            address_city,
            address_street,
            address_zipcode,
            phone_number,
        ]);

        return user;
    } catch (error) {
        throw error;
    }
}

// Get user by username and password for authentication
async function getUser(username, password) {
    if (!username || !password) {
        return;
    }
    try {
        const user = await getUserByUsername(username);
        if (!user) {
            console.log("User not found");
            return;
        }
        const hashedPassword = user.password;
        const passwordsMatch = await bcrypt.compare(password, hashedPassword);
        if (!passwordsMatch) {
            console.log("Passwords do not match");
            return;
        }
        delete user.password;
        console.log("User authenticated:", user);
        return user;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function getUserById(userId) {

    try {
        const { rows: [user] } = await client.query(`
        SELECT id, username, email, first_name, last_name, address_city, address_street, address_zipcode, phone_number, role, created_at
        FROM users
        WHERE id = $1;
    `, [userId]);
        return user;
    } catch (error) {
        throw error;
    }
}
async function getUserByUsername(username) {

    try {
        const { rows } = await client.query(`
        SELECT id, username, email, password, first_name, last_name, address_city, address_street, address_zipcode, phone_number, role, created_at
        FROM users
        WHERE username = $1;
    `, [username]);
        // if it doesn't exist, return null
        if (rows.length === 0) {
            console.log(`No user found for username: ${username}`);

            return null;
        }
        const user = rows[0];
        return user;
    } catch (error) {
        console.error(error)
    }
}


async function updateUser(userId, updatedUserInfo) {
    const {
        username,
        email,
        first_name,
        last_name,
        address_city,
        address_street,
        address_zipcode,
        phone_number
    } = updatedUserInfo;

    try {
        const { rows: [updatedUser] } = await client.query(`
            UPDATE users
            SET username = $1, email = $2, first_name = $3, last_name = $4,
                address_city = $5, address_street = $6, address_zipcode = $7, phone_number = $8
            WHERE id = $9
            RETURNING id, username, email, first_name, last_name,
                address_city, address_street, address_zipcode, phone_number, created_at;
        `, [
            username,
            email,
            first_name,
            last_name,
            address_city,
            address_street,
            address_zipcode,
            phone_number,
            userId
        ]);

        return updatedUser;
    } catch (error) {
        throw error;
    }
}

async function getAllUsers() {
    try {
        const { rows } = await client.query(`
        SELECT id, username, email, first_name, last_name, address_city, address_street, address_zipcode, phone_number,role, created_at
        FROM users;
      `);
        return rows;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
    updateUser,
    getAllUsers
}
