const errorHandlers = (err, required, res, next) => {
  console.log(err);
  if (err.name === "SequelizeValidationError") {
    err = err.errors.map((el) => el.message);
    res.status(400).json({
      message: err,
    });
  } else if (err.name === "POST_NOT_FOUND") {
    res.status(404).json({
      message: "Post not found",
    });
  } else {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = errorHandlers;
