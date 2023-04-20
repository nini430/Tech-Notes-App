const express = require('express');

const {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
} = require('../controllers/usersController');

const router = express.Router();

router
  .route('/')
  .get(getAllUsers)
  .post(addUser)

  router.route('/:id').patch(updateUser).delete(deleteUser)

module.exports = router;
