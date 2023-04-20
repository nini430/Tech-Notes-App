const { logEvent } = require('../middleware/logger');

const errorHandler = (err, req, res, next) => {
  const message = `${err.name}-${err.message} ${req.method} ${req.url} ${req.headers.origin}`;
  logEvent(message, 'reqErrors.log');
  const status = res.statusCode ? res.statusCode : 500;
  return res.status(status).json({ message: err.message });
};

module.exports=errorHandler;
