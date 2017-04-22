// routes/product-routes.js

const express = require('express');

const productRoutes = express.Router();


productRoutes.get('/products', (req, res, next) => {
  res.render('products/products-list-view.ejs');
});


module.exports = productRoutes;
