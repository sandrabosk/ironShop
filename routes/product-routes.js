// routes/product-routes.js

const express = require('express');

const Product = require('../models/product-model.js');

const productRoutes = express.Router();


productRoutes.get('/products', (req, res, next) => {
  Product.find((err, productList) => {
    if (err) {
      next(err);
      return;
    }

    res.render('products/products-list-view.ejs', {
      products: productList
    });
  });
});


module.exports = productRoutes;
