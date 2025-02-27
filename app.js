const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const app = express();

// Routes
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const { whitelist } = require('validator');

// GLOBAL MIDDLE-WARES

//
app.use(helmet());
//

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Sorry, you have done too many requests, please try again an hour later!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

// Data sanitization aganist noSQL query injection.
app.use(mongoSanitize());

// Data sanitization aganist XSS.
app.use(xss());

// prevent parameter polution.
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'ratingAverage',
      'ratingsQuantity',
      'price',
    ],
  })
);
//

// Serving The static fiiles.
app.use(express.static(`${__dirname}/public`));

/*
app.use(function (req, res, next) {
  console.log('Hello from the MiddleWare 😜.');
  next();
});
*/

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

////////////////////////////////////////
// THE ALL ROUTES ARE HERE
///////////////////////////////////////
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  /* res.status(404).json({
    status: 'fail',
    message: `Can not find ${req.originalUrl} on this server.`,
  }); */

  /*
  const err = new Error(`Can not find ${req.originalUrl} on this server.`);
  err.status = 'fail';
  err.statusCode = 404;
  */

  next(new AppError(`Can not find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

/////////////////////////////////////////
// START THE SERVER THAT WAS MOCED FROM HERE.
