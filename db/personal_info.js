const client = require('./client');
const bcrypt = require('bcrypt');
const SALT_COUNT = 6;

// Get all user personal info
async function getAllUserPersonalInfo() {
    try {
        const { rows: personalInfoList } = await client.query('SELECT * FROM user_personal_info');
        return personalInfoList;
    } catch (error) {
        throw error;
    }
}

// Get personal info for a single user by user ID
async function getUserPersonalInfo(userId) {
    try {
        const { rows: [personalInfo] } = await client.query(`
            SELECT * FROM users
            WHERE id = $1;
        `, [userId]);
        return personalInfo;
    } catch (error) {
        throw error;
    }
}

// Update personal info for a user by user ID
async function updateUserPersonalInfo(userId, updatedInfo) {
    try {

        const keys = Object.keys(updatedInfo);
        const values = Object.values(updatedInfo);

        if (keys.length === 0) {
            console.log('No fields provided to update');
            return;
        }
        const setClauses = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');

        const query = `
            UPDATE users
            SET ${setClauses}
            WHERE id = $1;
        `;

        await client.query(query, [userId, ...values]);

        console.log('Personal info updated successfully');
    } catch (error) {
        throw error;
    }
}

// Update Password 
async function updateUserPassword(userId, currentPassword, newPassword) {
    try {
        const { rows } = await client.query(`
        SELECT password
        FROM users
        WHERE id = $1;
    `, [userId]);

        if (rows.length === 0) {
            console.log(`No user found for userId: ${userId}`);
            return { success: false, message: "User not found." };
        }

        const user = rows[0];
        const passwordsMatch = await bcrypt.compare(currentPassword, user.password);

        if (!passwordsMatch) {
            return { success: false, message: "Current password is incorrect." };
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, SALT_COUNT);
        await client.query(`
            UPDATE users
            SET password = $1
            WHERE id = $2;
        `, [hashedNewPassword, userId]);

        return { success: true, message: "Password updated successfully." };

    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = {
    getAllUserPersonalInfo,
    getUserPersonalInfo,
    updateUserPersonalInfo,
    updateUserPassword
};
