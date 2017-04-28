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


  //  /product-details?id=1788
  //  /product-details?id=9999
  //  /product-details?id=5577
productRoutes.get('/product-details', (req, res, next) => {
    //      /product-details? id =777777777
    //                         |
  const productId = req.query.id;

  Product.findById(productId, (err, theProduct) => {
    if (err) {                        // |
      next(err);                      // =====================                                         // |
      return;                                             // |
    }                                                     // |
                                                          // |
    // DOESN'T WORK                                       // |
    // // 404 if no product was found (i.e. bullshit id)  // |
    // if (!theProduct) {                                 // |
    //   next();                                          // |
    //   return;                                          // |
    // }                                                  // |
                                                          // |
    res.render('products/product-details-view.ejs', {     // |
      product: theProduct                                 // |
    });          // |                                     // |
  });            // ==========================================
});


module.exports = productRoutes;
