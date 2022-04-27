const express = require('express');

const router = express.Router();
const { getUser, updateUser } = require('../controllers/user');

router.get('/users/me', getUser);
router.patch('/users/me', updateUser);

module.exports = router;
