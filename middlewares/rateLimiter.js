const { RateLimiter } = require('limiter');
const ErrorTooManyRequests = require('../errors/ErrorTooManyRequests');

const limiter = new RateLimiter({
  tokensPerInterval: 50,
  interval: 'hour',
  fireImmediately: true,
});

module.exports = async function requestHandler(req, res, next) {
  const remainingRequests = await limiter.removeTokens(1);
  if (remainingRequests < 0) {
    next(new ErrorTooManyRequests('Слишком много запросов - ваш IP адрес ограничен по скорости'));
  } else {
    next();
  }
};
