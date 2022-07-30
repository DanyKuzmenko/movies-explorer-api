require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes/index');
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
  origin: ['http://movies-explorer-frontend-eight.vercel.app',
    'https://movies-explorer-frontend-eight.vercel.app'],
  credentials: true,
}));

app.use(routes);

app.use((req, res, next) => {
  next(new ErrorNotFound('Введен неправильный путь'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

async function main() {
  await mongoose.connect(NODE_ENV === 'production' ? MONGODB_ADDRESS : 'mongodb://localhost:27017/moviesdb');
  app.listen(PORT);
}

main();
