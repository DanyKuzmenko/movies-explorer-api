require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors, celebrate, Joi } = require('celebrate');
const userRoutes = require('./routes/user');
const movieRoutes = require('./routes/movie');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const ErrorNotFound = require('./errors/ErrorNotFound');
const requestHandler = require('./middlewares/rateLimiter');

const { PORT = 3000, NODE_ENV, MONGODB_ADDRESS } = process.env;

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(helmet());
app.use(requestHandler);

app.use(cors({
  origin: ['http://dankuzmenko.movies.nomoredomains.work',
    'https://dankuzmenko.movies.nomoredomains.work'],
  credentials: true,
}));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use(userRoutes);
app.use(movieRoutes);

app.use((req, res, next) => {
  next(new ErrorNotFound('Введен неправильный путь'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

async function main() {
  await mongoose.connect(NODE_ENV === 'production' ? MONGODB_ADDRESS : 'mongo-secret');
  app.listen(PORT);
}

main();
