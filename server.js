const mongoose = require('mongoose');
const dotenv = require('dotenv');

// uncaughtException Error handleing.
process.on('uncaughtException', (err) => {
  console.log('UN CAUGHT EXCEPTION ERROR 💥💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

/*THE NEW VERSION OF THE CONNECTION TO ATLAS DB.*/
// mongoose
//   .connect(DB)
//   .then(() => {
//     console.log('DB Atlas Connection Succesfull!');
//   })
//   .catch((err) => {
//     console.error('BB Atlas Connection Error: ', err);
//   });

/* THE LOCAL DATABASE CONNECTION NEW VERVION*/
mongoose.connect(process.env.DATABASE_LOCAL).then((con) => {
  console.log(con.connections);
  console.log('DB Local Connection Successful!');
});
// .catch((err) => console.log('ERROR'));

//
//
//
/*
const testTour = new Tour({
  name: 'The best Park camper in Herat.',
  rating: 4.7,
  price: 479,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR 💥💥', err);
  });*/

// EVIRONEMNT VARAIABLES.
// console.log(process.env);

// START THE SERVER.
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app runing on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UN HANDLEED THE REJECTION 💥💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// uncaughtException error is handled at the first.
