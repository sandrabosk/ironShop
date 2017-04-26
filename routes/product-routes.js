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

productRoutes.get('/products/new', (req, res, next) => {
  res.render('products/new-product-view.ejs');
});

// <form method="post" action="/products/new">
//                |                  |
//             ====       ============
//             |          |
productRoutes.post('/products/new', (req, res, next) => {

                                  // <input name="productName">
const theProduct = new Product({  //                  |
      //               ================================
      //               |
    name: req.body.productName,
    price: req.body.productPrice,
    imageUrl: req.body.productImageUrl,
    description: req.body.productDescription
  });

  theProduct.save((err) => {
    if (err) {
      next(err);
      return;
    }

      // http://localhost:3000/products
      //                          |
      //              =============
      //              |
    res.redirect('/products');
      // redirect instead of render!
      // this way, refreshing the page doesn't create duplicates.
  });
});


module.exports = productRoutes;
