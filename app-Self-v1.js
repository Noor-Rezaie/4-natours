const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json());

/*
// App Get
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side.', app: 'Natrouse' });
});

// App Post
app.post('/', (req, res) => {
  res.send('You can post to this URL...');
});
*/

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// GET FOR CATCH OR FETCHING THE DATA
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'succeess',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

//FETCH THE EXACT DATA BY ID.
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Sorry, you have entered a Invalid ID.',
    });
  }

  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'succeess',
    results: tours.length,
    data: {
      tour: tour,
    },
  });
});

// POST FOR INSERTING THE DATA
app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  );
});

// USING (PUT OR PATCH) FOR UPDATING DATA.
app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Sorry, you have entered a Invalid ID.',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
});

//
// USING (DELETE) FOR DELETEING DATA IN HTTP.
app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Sorry, you have entered a Invalid ID.',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`app runing on port ${port}...`);
});
