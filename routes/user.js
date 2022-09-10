const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
  photoUpload,
  createUser,
  getUser,
  getUserById,
  login,
} = require('../controllers/user');

router.route('/create').post(createUser);
router.route('/get').get(getUser);
router.route('/get/:id').get(getUserById);
router.route('/login').post(login);
router.route('/:id/photoupload').put(protect, photoUpload);

module.exports = router;
