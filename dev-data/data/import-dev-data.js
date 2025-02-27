const fs = require('fs');
const mongoose = require('mongoose');
const app = require(`./../../app`);
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

dotenv.config({ path: './config.env' });

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

// READ THE JSON FILES.
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// IMPORT DATA TO DATABASES.
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded to databaes.');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//DELETE ALL DATA FROM DATABAES OR COLLECTION.
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Boom! ,Data has been deleted successfully from DBs.');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// console.log(process.argv);
