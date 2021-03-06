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
      //               ==================================
      //               |
    name: req.body.productName,
    price: req.body.productPrice,
    imageUrl: req.body.productImageUrl,
    description: req.body.productDescription
  });

  theProduct.save((err) => {
    if (err) {
      res.render('products/new-product-view.ejs', {
        validationErrors: theProduct.errors
      });
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


productRoutes.get('/products/expensive', (req, res, next) => {
  Product
    .find()
    .sort({ price: -1 })   // REVERSE order (a.k.a. "descending")
    .limit(10)
    .exec((err, productList) => {
      if (err) {
        next(err);
        return;
      }

      res.render('products/expensive-view.ejs', {
        products: productList
      });
    });
});

productRoutes.get('/products/value', (req, res, next) => {
  Product
    .find()
    .sort({ price: 1 })   // NORMAL order (a.k.a. "ascending")
    .limit(10)
    .exec((err, productList) => {
      if (err) {
        next(err);
        return;
      }

      res.render('products/cheap-view.ejs', {
        products: productList
      });
    });
});


// OLD VERSION ===> using query strings
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                    /product-details?id=1788
//                    /product-details?id=9999
//                    /product-details?id=5577
// productRoutes.get('/product-details', (req, res, next) => {
//             /product-details? id =777777777
//                                |
//   const productId = req.query.id;
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


  //               /products/1788
  //               /products/9999
  //               /products/5577
productRoutes.get('/products/:id', (req, res, next) => {
    //                         |
  const productId = req.params.id;

    // db.products.findOne( { _id: productId } )
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

  //               /products/444/edit
  //               /products/123/edit
  //               /products/20/edit
productRoutes.get('/products/:id/edit', (req, res, next) => {
    //                         |
  const productId = req.params.id;

  Product.findById(productId, (err, theProduct) => {
    if (err) {
      next(err);
      return;
    }

    res.render('products/edit-product-view.ejs', {
      product: theProduct
    });
  });
});

productRoutes.post('/products/:id', (req, res, next) => {
    //                          |
  const productId = req.params.id;

    // gather the form values into an object
  const productChanges = {
    name: req.body.productName,
    price: req.body.productPrice,
    imageUrl: req.body.productImageUrl,
    description: req.body.productDescription
  };

  Product.findByIdAndUpdate(
      // 1st arg -> which document (id of the document)
    productId,
      // 2nd arg -> which changes to save (from the form)
    productChanges,
      // 3rd arg -> CALLBACK!
    (err, theProduct) => {
      if (err) {
        next(err);
        return;
      }

      // this is how you would redirect to product details page
      // res.redirect(`/products/${productId}`);

      res.redirect('/products');
    }
  );
});

productRoutes.post('/products/:id/delete', (req, res, next) => {
    //                          |
  const productId = req.params.id;

    // db.products.deleteOne({ _id: productId })
  Product.findByIdAndRemove(productId, (err, theProduct) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect('/products');
  });
});

productRoutes.get('/search', (req, res, next) => {
  const searchTerm = req.query.productSearchTerm;

  if (!searchTerm) {
    res.render('products/search-view.ejs');
    return;
  }

  const searchRegex = new RegExp(searchTerm, 'i');

  Product.find(
    { name: searchRegex },
    (err, searchResults) => {
      if (err) {
        next(err);
        return;
      }

      res.render('products/search-view.ejs', {
        products: searchResults
      });
    }
  );
});


module.exports = productRoutes;
