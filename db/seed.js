const client = require('./client');
const { rebuildDB, testDB } = require('./seedData');

async function seedDatabase() {
    try {
        await rebuildDB();
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the database connection when done
        client.end();
    }
}

seedDatabase();




