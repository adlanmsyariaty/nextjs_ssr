const jwt = require("jsonwebtoken");
const secretKeyword = process.env.SECRET;

const tokenGenerator = (payload) =>
  jwt.sign(payload, secretKeyword, { expiresIn: "24h" });

const payloadReader = (token) => jwt.verify(token, secretKeyword);

module.exports = {
  tokenGenerator,
  payloadReader,
};
