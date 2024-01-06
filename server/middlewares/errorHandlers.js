const errorHandlers = (err, req, res, next) => {
  if (err.name === "SequelizeValidationError") {
    err = err.errors.map((el) => el.message);
    res.status(400).json({
      success: false,
      message: err,
    });
  } else if (err.name === "POST_NOT_FOUND") {
    res.status(404).json({
      success: false,
      message: "Post not found",
    });
  } else if (err.name === "SequelizeUniqueConstraintError") {
    res.status(400).json({
      success: false,
      message: "Username is already registered",
    });
  } else if (err.name === "INVALID_USER") {
    res.status(401).json({
      success: false,
      message: "Invalid username/password",
    });
  } else if (err.name === "UNAUTHORIZED") {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  } else if (err.name === "USERNAME_IS_REQUIRED") {
    res.status(400).json({
      success: false,
      message: "Username is required",
    });
  } else if (err.name === "PASSWORD_IS_REQUIRED") {
    res.status(400).json({
      success: false,
      message: "Password is required",
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = errorHandlers;
