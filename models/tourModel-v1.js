const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');
const validator = require('validator');
const { type } = require('superagent/lib/utils');

// THE SCHEMA AND THE MODEL HAS BEEN MADE.
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have name price and rating!'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour maust have <=40 Chars.'],
      minlength: [10, 'A tour mast have more than 10 chars.'],
      // validate: [validator.isAlpha, 'The name should be only characterse.'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'a tour must have a duration.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size.'],
    },
    difficulty: {
      type: String,
      required: [true, 'a tour must have a difficulty.'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty should be either EASy MEDIUM or DIFFICULT.',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be less than 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: `Discount price ({VALUE}) should be below than reqular price...`,
      },
    },
    summary: {
      type: String,
      required: [true, 'a tour must have a Summary or Describtion.'],
      trim: true,
    },
    describtion: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must ahve image Cover.'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      cordinates: [Number],
      address: String,
      describtion: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        cordinates: [Number],
        address: String,
        day: Number,
      },
    ],
    guides: Array,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLE-WARE FROM MONGOOS MIDDLE-WARE.
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// This doing byusing the Embeded methode for DBs
tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});
//

//////////////////////////////////////////
//////////////////////////////////////////
/*
tourSchema.pre('save', function () {
  console.log('Will save document...');
  next();
});

tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});
*/

// QUERY MIDDLE-WARE
// tourSchema.pre('find', function () {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`The query has taken ${Date.now() - this.start} milliseconds...`);
  next();
});

// AGGREGATION MIDDLE-WARE.
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
