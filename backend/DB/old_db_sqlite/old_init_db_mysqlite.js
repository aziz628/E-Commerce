// one time use code 
// create tables
const sqlite= require('sqlite3').verbose()
const path=require('path')
const db_path=path.join(__dirname,'db.sqlite')
const db=new sqlite.Database(db_path, (err) => {
// look for file in absolute path or start from CWD if relative
    if (err) {
        console.error(err.message);
    } else {
        // Enable foreign key support
        db.run('PRAGMA foreign_keys = ON;', (err) => {
            if (err) {
                console.error("Error enabling foreign keys:", err.message);
            } else {
                console.log("Foreign key support enabled");
            }
        });
    }
});

// serialize here is just for trial 
// it's just one command
db.serialize(()=>{
    //run no return command
    db.run(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    `,(err)=>{
        if(err){
            console.error('Error creating table:', err);
        }else{
            console.log("table created or already exist")
        }
    });
    //id, name, description, price,
    // discounted_price, category, image_url, rating, sale_tag
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        price REAL NOT NULL ,
        discounted_price REAL,
        image_url TEXT NOT NULL  ,
        quantity INTEGER NOT NULL,
        category TEXT NOT NULL
    );
    
    `,(err)=>{
        if(err){
            console.error('Error creating table:', err);
        }else{
            console.log("products created or already exist")
        }
    })
    db.run(`
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

    ('Note 10 Pro 128GB 6GB RAM Factory Unlocked (GSM ONLY) International Model', 699.00, 659.00, '/img/today-deal/electronic-store-product-image-21.jpg',5, 'PCs_Laptops'),
    ('5G Unlocked Smartphone, 12GB RAM+256GB Storage, 120Hz Fluid Display, Hasselblad Quad Camera, 65W Ultra Fast Charge, 50W Wireless Charge', 1099.00, 999.00, '/img/today-deal/electronic-store-product-image-36.jpg',5, 'PCs_Laptops'),
    ('5G Factory Unlocked Android Cell Phone, 128GB, Pro-Grade Camera, 30X Space Zoom, Night Mode, Space Grey', 1099.00, 999.00, '/img/today-deal/electronic-store-product-image-22.jpg',5, 'PCs_Laptops'),
    ('13 Ultrabook Gaming Laptop: Intel Core i7-1165G7 4 Core, NVIDIA GeForce GTX 1650 Ti Max-Q, 13.3″ 1080p 120Hz, 16GB RAM, 512GB SSD, CNC Aluminum, Chroma RGB, Thunderbolt 4', 1499.00, 1399.00, '/img/today-deal/electronic-store-product-image-19.jpg',5, 'PCs_Laptops'),
    ('15.6″ FHD Display Laptop - Intel i7 - Intel HD Graphics 6000, Webcam, WiFi, Bluetooth, HDMI, Windows 11, Grey', 1029.00, 999.50, '/img/today-deal/electronic-store-product-image-18.jpg',5, 'PCs_Laptops');
`,(err) => {
    if (err) {
        console.error('Error inserting products:', err);
    } else {
        console.log("Sample products inserted");
    }
});
db.run(`CREATE TABLE   reset_tokens(
    id INTEGER  PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    user_id INTEGER ,
    FOREIGN KEY  (user_id) REFERENCES users(id) 
);`)
//refresh tokens
db.run(`CREATE TABLE  IF NOT EXISTS refresh_tokens(
    id INTEGER  PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    user_id INTEGER ,
    FOREIGN KEY  (user_id) REFERENCES users(id) 
);`)

/* replaced by redis
 db.run(`
    CREATE TABLE IF NOT EXISTS requests_limits (
      key TEXT PRIMARY KEY ,
      count INTEGER NOT NULL,
      expiresAt INTEGER NOT NULL
    );
  `);
  */
} )

db.run(`update requests_limits set count = 1`)

db.close();