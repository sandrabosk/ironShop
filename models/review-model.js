const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const reviewSchema = new Schema({
  content: { type: String },
  stars: { type: Number },
  author: { type: String },
  // BY REFERENCE INSTEAD OF SUBDOCUMENTS
  // product: { type: Schema.Types.ObjectId }
});

const Review = mongoose.model('Review', reviewSchema);


module.exports = Review;


// --------------------------

// SAVING BY REFERENCE
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~``
// theReview = new Review({
//   content: req.body.content,
//   stars: req.body.stars,
//   author: req.body.author,
//   product: req.params.productId
// });
