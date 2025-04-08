// const fs = require('fs');
// const path = require('path');

const db = require('../util/database');

// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   'data',
//   'products.json'
// );

// const getProductsFromFile = (cb) => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     } else {
//       try {
//         cb(JSON.parse(fileContent));
//       } catch (parseErr) {
//         cb([]);
//       }
//     }
//   });
// };

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  // save() {
  //   const rand = 1000;
  //   this.id = Math.floor(Math.random() * 1000 + rand).toString();
  //   getProductsFromFile((products) => {
  //     products.push(this);
  //     fs.writeFile(p, JSON.stringify(products), (err) => {
  //       console.log(err);
  //     });
  //   });
  // }

  save() {
    return db.execute(
      'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static fetchAll() {
    // getProductsFromFile(cb);

    // db.execute('SELECT * FROM products', [])
    //   .then(([rows, fieldData]) => {
    //     cb(rows);
    //   })
    //   .catch(err => console.log(err));

    return db.execute('SELECT * FROM products', []);
  }

  static fetchById(idx) {
    // getProductsFromFile((products) => {
    //   const product = products.find((p) => p.id === idx);
    //   cb(product);
    // });

    return db.execute('SELECT * FROM products WHERE products.id = ?', [idx]);
  }
};
