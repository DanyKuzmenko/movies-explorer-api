const express = require('express');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const router = express.Router();
const { getUser, updateUser, login, createUser } = require('../controllers/user');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  }),
}), createUser);
router.get('/users/me', auth, getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), auth, updateUser);

module.exports = router;
