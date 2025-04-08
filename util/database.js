const mysql = require('mysql2');

const pool = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'node_complete',
  password: 'root@123',
});

// class Product {
//     constructor(title, imageUrl, description, price) {
//       this.title = title;
//       this.imageUrl = imageUrl;
//       this.description = description;
//       this.price = price;
//     }
//   }

// const products = [
//   new Product(
//     "T-Shirt",
//     "https://images.pexels.com/photos/1002641/pexels-photo-1002641.jpeg",
//     "Comfortable cotton t-shirt",
//     19.99
//   ),
//   new Product(
//     "Sneakers",
//     "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
//     "Lightweight running shoes",
//     59.99
//   ),
//   new Product(
//     "Backpack",
//     "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg",
//     "Durable travel backpack",
//     39.99
//   ),
//   new Product(
//     "Headphones",
//     "https://images.pexels.com/photos/159853/headphones-headset-audio-equipment-technology-159853.jpeg",
//     "Noise-cancelling over-ear headphones",
//     89.99
//   ),
//   new Product(
//     "Smartwatch",
//     "https://images.pexels.com/photos/2773946/pexels-photo-2773946.jpeg",
//     "Fitness tracker and notifications",
//     129.99
//   ),
//   new Product(
//     "Laptop",
//     "https://images.pexels.com/photos/18105/pexels-photo.jpg",
//     "Lightweight and powerful laptop",
//     999.99
//   ),
//   new Product(
//     "Water Bottle",
//     "https://images.pexels.com/photos/844923/pexels-photo-844923.jpeg",
//     "Insulated stainless steel bottle",
//     14.99
//   ),
//   new Product(
//     "Gaming Chair",
//     "https://images.pexels.com/photos/5553067/pexels-photo-5553067.jpeg",
//     "Ergonomic chair with lumbar support",
//     199.99
//   ),
//   new Product(
//     "Desk Lamp",
//     "https://images.pexels.com/photos/209807/pexels-photo-209807.jpeg",
//     "LED lamp with adjustable brightness",
//     24.99
//   ),
//   new Product(
//     "Bluetooth Speaker",
//     "https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg",
//     "Portable speaker with deep bass",
//     49.99
//   ),
// ];

// pool.query('TRUNCATE TABLE products', (err, result) => {
//     if (err) throw err;
//     console.log('All products deleted and ID reset.');
//   });

// pool.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to MySQL");

//   const sql =
//     "INSERT INTO products (title, imageUrl, description, price) VALUES ?";

//   const values = products.map((p) => [
//     p.title,
//     p.imageUrl,
//     p.description,
//     p.price,
//   ]);

//   pool.query(sql, [values], (err, result) => {
//     if (err) throw err;
//     console.log(`Inserted ${result.affectedRows} products.`);
//     pool.end();
//   });
// });

module.exports = pool.promise();
