const mysql = require('mysql2/promise');  // Use mysql2/promise for promises
require('dotenv').config({ path: 'config/.env' });  // Load environment variables
console.log(process.cwd())
// Create MySQL connection using promise-based API
async function init() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306,
  });

  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_seen_notif_id int default null,
        
        foreign key(last_seen_notif_id) references notifications(id) ON DELETE CASCADE
      );
    `);
    console.log("Users table created or already exists");

    // Create products table
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        discounted_price DECIMAL(10,2),
        image_url TEXT NOT NULL,
        quantity INT NOT NULL,
        category VARCHAR(255) NOT NULL
      );
    `);
    console.log("Products table created or already exists");
/*
    // Insert sample data into products table
    await db.query(`
      INSERT INTO products (description, price, discounted_price, image_url, quantity, category) VALUES
      ('Max SR Home Theater Surround Sound Bar HDMI, Optical Cables, Wireless Subwoofer & Two Speakers', 1099.00, 999.00, '/img/audio/electronic-store-product-image-41-600x600.jpg', 10, 'Audio_Video'),
      ('V-Series 5.1 Home Theater Sound Bar with Dolby Audio, Bluetooth, Wireless Subwoofer, Voice Assistant Compatible', 1099.00, 999.00, '/img/audio/electronic-store-product-image-40-600x600.jpg', 5, 'Audio_Video'),
      ('OLED C1 Series 55” 4k Smart TV (3840 x 2160), 120Hz Refresh Rate, AI-Powered 4K, Dolby Cinema, WiSA Ready, Gaming Mode', 1099.00, 999.00, '/img/audio/electronic-store-product-image-39.jpg', 8, 'Audio_Video'),
      ('X80J 55 Inch TV: 4K Ultra HD LED Smart Google TV with Dolby Vision HDR', 1099.00, 999.00, '/img/audio/electronic-store-product-image-38-600x600.jpg', 12, 'Audio_Video'),
      ('Multigroomer All-in-One Trimmer Series 5000, 23 Piece Mens Grooming Kit', 49.00, 44.00, '/img/home-appliance/electronic-store-product-image-27-600x600.jpg', 20, 'Home_Appliances'),
      ('Compact Pulsator Washer for Clothes, .9 Cubic ft. Tub, White, BPAB10WH', 319.00, 259.00, '/img/home-appliance/electronic-store-product-image-12-600x600.jpg', 15, 'Home_Appliances'),
      ('Full-Automatic Compact Washer with Wheels, 1.6 cu. ft, 11 lbs capacity with 6 Wash Programs Washer', 309.00, 279.00, '/img/home-appliance/electronic-store-product-image-13-600x600.jpg', 7, 'Home_Appliances'),
      ('Small Space Heat Pump Dryer with Sensor Dry, 12 Preset Machine Cycles, 40 Minute Express Drying', 349.00, 349.00, '/img/home-appliance/electronic-store-product-image-14-600x600.jpg', 3, 'Home_Appliances'),
      ('0.9 Cubic Feet Capacity 900 Watts Kitchen Essentials for the Countertop Stainless Steel', 599.00, 559.00, '/img/kitchen/electronic-store-product-image-9-600x600.jpg', 10, 'Kitchen_Appliances'),
      ('Microwave Oven with Smart Sensor Easy Clean Interior ECO Mode 1.2 Cu Ft Stainless Steel', 529.00, 509.00, '/img/kitchen/electronic-store-product-image-3-600x600.jpg', 6, 'Kitchen_Appliances'),
      ('Double Door Mini Fridge with Freezer for Office or Dorm with Adjustable Remove Glass Shelves', 479.00, 479.00, '/img/kitchen/electronic-store-product-image-8-600x600.jpg', 4, 'Kitchen_Appliances'),
      ('36″ Side-by-Side Refrigerator and Freezer with 25 Cubic Ft. Total Capacity, Black', 799.00, 749.00, '/img/kitchen/electronic-store-product-image-6-600x600.jpg', 9, 'Kitchen_Appliances'),
      ('Note 10 Pro 128GB 6GB RAM Factory Unlocked (GSM ONLY) International Model', 699.00, 659.00, '/img/today-deal/electronic-store-product-image-21.jpg', 5, 'PCs_Laptops'),
      ('5G Unlocked Smartphone, 12GB RAM+256GB Storage, 120Hz Fluid Display, Hasselblad Quad Camera, 65W Ultra Fast Charge, 50W Wireless Charge', 1099.00, 999.00, '/img/today-deal/electronic-store-product-image-36.jpg', 5, 'PCs_Laptops'),
      ('5G Factory Unlocked Android Cell Phone, 128GB, Pro-Grade Camera, 30X Space Zoom, Night Mode, Space Grey', 1099.00, 999.00, '/img/today-deal/electronic-store-product-image-22.jpg', 5, 'PCs_Laptops'),
      ('13 Ultrabook Gaming Laptop: Intel Core i7-1165G7 4 Core, NVIDIA GeForce GTX 1650 Ti Max-Q, 13.3″ 1080p 120Hz, 16GB RAM, 512GB SSD, CNC Aluminum, Chroma RGB, Thunderbolt 4', 1499.00, 1399.00, '/img/today-deal/electronic-store-product-image-19.jpg', 5, 'PCs_Laptops'),
      ('15.6″ FHD Display Laptop - Intel i7 - Intel HD Graphics 6000, Webcam, WiFi, Bluetooth, HDMI, Windows 11, Grey', 1029.00, 999.50, '/img/today-deal/electronic-store-product-image-18.jpg', 5, 'PCs_Laptops');
    `);
    console.log("Sample products inserted");
*/
    // Create reset_tokens table
    await db.query(`
        CREATE TABLE IF NOT EXISTS reset_tokens(
          id INT AUTO_INCREMENT PRIMARY KEY ,
          token TEXT NOT NULL,
          expires_at BIGINT NOT NULL,
          user_id INT,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
    
    console.log("Reset tokens table created or already exists");

    // Create refresh_tokens table
    await db.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens(
        id INT AUTO_INCREMENT PRIMARY KEY,
        token TEXT NOT NULL,
        expires_at BIGINT NOT NULL,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log("Refresh tokens table created or already exists");

    // Create notifications and user_notifications tables
    await db.query(` CREATE TABLE IF NOT EXISTS  notifications(
      id INT AUTO_INCREMENT primary key,
      message TEXT NOT NULL ,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP 
      );`);
      // mysql script to change from timestamp for created_at column to datetime
      // ALTER TABLE notifications MODIFY created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
      await db.execute(`create  TABLE IF NOT EXISTS user_notifications(
        user_id int not null,
        notif_id int not null,
        primary key(user_id,notif_id),
        foreign key (user_id) references users(id) on delete cascade ,
        foreign key (notif_id) references notifications (id) on delete cascade 
      )`)
  } catch (err) {
    console.error('Error during initialization:', err.message);
  } finally {
    // Close connection after initialization is complete
    await db.end();  // `end` should work with `mysql2/promise`
    console.log('Connection closed');
  }
}

// Call init function to start the process
init();
