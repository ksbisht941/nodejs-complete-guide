const express = require('express');
// const path = require('path');
// const rootDir = require('../util/path');
const adminController = require('../controllers/admin');
const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product => POST
router.post('/product', adminController.postAddProduct);

// exports.routes = router;
// exports.products = products;

module.exports = router;
