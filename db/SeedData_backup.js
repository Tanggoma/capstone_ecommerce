// const createUser = require('./');
const client = require('./client');

async function dropTables() {
    console.log('Dropping All Tables...');
    // drop all tables, in the correct order
    try {
        await client.query(`
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS categories CASCADE;
    DROP TABLE IF EXISTS carts CASCADE;
    DROP TABLE IF EXISTS wishlist CASCADE;
    DROP TABLE IF EXISTS reviews CASCADE;
  `)
    } catch (error) {
        throw error;
    }
}

async function createTables() {
    try {
        console.log("Starting to build tables...");

        await client.query(`
        CREATE TABLE categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        );
        
    `)

        await client.query(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255),
            last_name VARCHAR(255),
            address_city VARCHAR(255),
            address_street VARCHAR(255),
            address_zipcode VARCHAR(10),
            phone_number VARCHAR(20),
            role VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `)
        await client.query(`
        CREATE TABLE products (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            brand VARCHAR(255),
            "description" TEXT, 
            price DECIMAL(10, 2) NOT NULL,
            category_id INTEGER REFERENCES categories(id),
            image_url VARCHAR(255),
            available_units INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `)

        await client.query(`
        CREATE TABLE carts (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            product_id INTEGER REFERENCES products(id),
            quantity INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
            
    `)
        await client.query(`
        CREATE TABLE wishlist (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            product_id INTEGER REFERENCES products(id),
            quantity INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
             
    `)
        await client.query(`
        CREATE TABLE orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            total_amount DECIMAL(10, 2) NOT NULL,
            order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
             
    `)
        await client.query(`
        CREATE TABLE order_items (
            id SERIAL PRIMARY KEY,
            order_id INTEGER REFERENCES orders(id),
            product_id INTEGER REFERENCES products(id),
            quantity INTEGER NOT NULL,
            price DECIMAL(10, 2) NOT NULL
        );
             
    `)
        await client.query(`
        CREATE TABLE reviews (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            product_id INTEGER REFERENCES products(id),
            rating INTEGER CHECK (rating >= 0 AND rating <= 5) NOT NULL,
            text TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
 
    `)

        console.log("Finished building tables!");
    } catch (error) {
        console.error("Error building tables!");
        throw error;
    }
}

// Create initial data

async function createInitialData() {
    try {
        console.log('Creating Initial Data...');

        await client.query(`
    INSERT INTO categories (name)
    VALUES

            ('BCD'),
            ('Regulator' ),
            ('Dive Computer' ),
            ( 'Mask' ),
            ('Wetsuit' ),
            ( 'Fins' ),
            ( 'Pressure Gauges' )`
        );

        await client.query(`
      INSERT INTO users (username, email, password,first_name, last_name, address_city, address_street, address_zipcode, phone_number,role)
      VALUES
      ('tantan', 'tantan@gmail.com', 'tan99','Tan', 'Tiachanpan', 'New York', '123 Main St', '33024', '123-456-7890','user'),
      ('winter', 'winter@gmail.com', 'winter99','Winlada', 'Aldrich', 'Bangkok', '123 Main St', '33026', '133-456-7890','user'),
      ('aaron', 'aaron@gmail.com', 'aaron99','Aaron', 'Jernigan', 'Miami', '123 Main St', '33025', '124-456-7890', 'guest')
    `);

        await client.query(`
  INSERT INTO products (title, brand, "description", price, category_id, image_url, available_units)
  VALUES
  ('Zeagle Stiletto Scuba BCD', 'Zeagle', 'The Zeagle Stiletto Scuba BCD is built to last and employs a unique Personal Fit System that lets you size the shoulders, vest, sternum, and cummerbund independently for a true custom fit. Additional comfort is offered by Zeagle''s innovative soft backpack design, which has no hard or heavy plastic components', 699.95, 1, 'https://www.divers-supply.com/media/catalog/product/cache/04f855d5dde875e44e832ab401f00a9d/image/888819244/mares-grace-ergotrim.jpg', 15),
  ('Aqua Lung Titan Regulator 3rd Gen', 'Aqua Lung', 'Breathe easythe third-generation Titan regulator brings updated design to this perennial favorite while keeping its excellent value. It''s a new look with the unchanged light weight, rugged durability, and easy-breathing functionality of its predecessors. And it still offers excellent performance and hassle-free maintenance.', 475.00, 2, 'https://www.divers-supply.com/media/catalog/product/cache/04f855d5dde875e44e832ab401f00a9d/image/89406c309/aqua-lung-titan-3rd-gen-regulator.jpg', 10),
  ('Suunto D4F Freedive Computer', 'Suunto', 'Suunto D4f is a light yet robust freedive computer, that makes underwater sports enjoyable. When diving, the D4f displays your present and maximum depth and calculates dive time and surface intervals for you, allowing you to fully concentrate on exploring the underwater world. Use the apnea timer to improve your breathing technique. After the dive you can browse the details of your dive from the logbook. The light-weight case with stainless steel bezel and mineral crystal glass make Suunto D4f not only a trusted tool when exploring the depths, but also looks good wearing day to day.', 449.95, 3, 'https://www.divers-supply.com/media/catalog/product/cache/04f855d5dde875e44e832ab401f00a9d/image/717127f46/suunto-d4f-freedive-computer.png', 10),
  ('Cressi Tropical Mask', 'Cressi', 'A mask particularly suitable for free diving and snorkeling, but just as appropriate for use in scuba diving. It has separate lenses, a skirt edge that adapts to most faces, and a small inner volume, perfect for freedivers. It is made from soft transparent or dark silicone and has strong rapid-action buckles to adjust the strap. Features a reinforced frame and a universal strap size.', 25.95, 4, 'https://www.divers-supply.com/media/catalog/product/cache/04f855d5dde875e44e832ab401f00a9d/image/890773eb7/cressi-tropical-mask.jpg', 10),
  ('ScubaPro Everflex Yulex Steamer 5/4', 'ScubaPro', 'Internal cuff seals with zippered cuffs on ankles feature YKK brass sliders for durability and water tightness and are combined with fuse-cut wrists to make donning easy and provide real comfort.', 579.00, 5, 'https://www.divers-supply.com/media/catalog/product/cache/04f855d5dde875e44e832ab401f00a9d/image/881609eda/scubapro-everflex-yulex-steamer-5-4-men.jpg', 10),
  ('Mares Plana Avanti X3 Fins', 'Mares', 'The Mares Avanti X3 fin offers exceptional value and out performs many other fins. Optimising the thrust angle provided by 3 channel avanti system, this thermoplastic and rubber fin reduces the risk of cramping, and with its special ABS buckle makes fitting foolproof and easy. Superb quality fins at an exceptional price. The perfect combination of comfort, convenience and power. The mid-sized Tecralene blade has three channels to optimize the flow of water. Upper and lower stabilizers help maximize muscle energy conversion. The straps feature the ABS system for one-handed adjustment.', 131.95, 6, 'https://www.divers-supply.com/media/catalog/product/cache/04f855d5dde875e44e832ab401f00a9d/image/124821b1/mares-plana-avanti-x3-fins.jpg', 10),
  ('Cressi Mini 2 Gauge Console', 'Cressi', 'A small and a compact console that is known to house the Cressi mini pressure gauge and mini analog depth gauge.', 131.95, 7, 'https://www.divers-supply.com/media/catalog/product/cache/04f855d5dde875e44e832ab401f00a9d/image/45781f6b/cressi-mini-2-gauge-console.jpg', 10)
  `
        );

        await client.query(`
    INSERT INTO carts (user_id,product_id,quantity)
    VALUES
    ( 1,  1,  1 ),
    ( 2,  2,  2 ),
    ( 3,  4,  1 )
    `
        );
        await client.query(`
    INSERT INTO wishlist (user_id,product_id,quantity)
    VALUES
    ( 1,  7,  1 ),
    ( 2,  5,  1 ),
    ( 3,  6,  1 )
    `
        );
        await client.query(`
    INSERT INTO reviews (user_id,product_id,rating,text)
    VALUES
    ( 1, 1,5, 'very good!' ),
    (  2, 2, 3, 'just okay'),
    ( 3,  3, 1, 'worst product ever!')`
        );

        await client.query(`
            INSERT INTO orders (user_id, total_amount)
            VALUES
            (1, 699.95),
            (2, 950.00),
            (3, 25.95)
        `);

        await client.query(`
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES
            (1, 1, 1, 699.95),
            (2, 2, 2, 950.00),
            (3, 3, 1, 25.95)
        `);

    } catch (error) {
        throw error;
    }
}

// build all tables and create initial data
async function rebuildDB() {
    try {
        await dropTables();
        await createTables();
        await createInitialData();
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
}

module.exports = {
    rebuildDB
};