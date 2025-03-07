const Review = require('../models/reviewModel');
const factory = require('./handlerFactory.js');
// const catchAsync = require('./../utils/catchAsync');

////////////////////////////////
exports.setTourUserIds = (req, res, next) => {
  // In here we alowed the nested route.
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.tourId;
  next();
};
////////////////////////////////

////////////////////////////////
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
////////////////////////////////
