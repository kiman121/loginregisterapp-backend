const handleDevErrors = (err, res) => {
  res.status(err.statusCode).send({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleProdErrors = (err, res) => {
  res.status(err.statusCode).send({
    status: err.status,
    message: err.message,
  });
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    handleDevErrors(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    handleProdErrors(err, res);
  }
};

export default errorHandler;
