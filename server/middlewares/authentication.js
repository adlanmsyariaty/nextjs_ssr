const { User } = require("../models");
const { payloadReader } = require("../helpers/jwt.js");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      throw { name: "UNAUTHORIZED", statusCode: 401 };
    }

    const payload = payloadReader(access_token);
    const selectedUser = await User.findByPk(payload.id);
    if (!selectedUser) {
      throw { name: "UNAUTHORIZED", statusCode: 401 };
    } else {
      req.user = {
        id: selectedUser.id,
        username: selectedUser.username,
      };
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
