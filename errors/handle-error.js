exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "not found" });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.err(err);
  
  console.error(err.stack); // Important for debugging
  const status = err.status || 500; // Default to 500 if status not set
  const msg = err.msg || "Internal Server Error"; // Default message
  res.status(status).send({ msg });
};
