class ErrorTooManyRequests extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 429;
  }
}

module.exports = ErrorTooManyRequests;
