const express = require('express');
// ///////////////////

////////////////////////////////////////////////////
// ROUTE HANDLERS FOR THE USERS:
// GET ALL THE USERS
function getAllUsers(req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This is not yet Avialable!😂',
  });
}
////////////////////////////////////
function getUser(req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This is not yet Avialable!😂',
  });
}
////////////////////////////////////
function createUser(req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This is not yet Avialable!😂',
  });
}
////////////////////////////////////
function updateUser(req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This is not yet Avialable!😂',
  });
}
////////////////////////////////////
function deleteUser(req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This is not yet Avialable!😂',
  });
}

// //////////////////
const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
