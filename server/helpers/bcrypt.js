const bcrypt = require("bcrypt");

const hashPassword = (password) => bcrypt.hashSync(password, 10);

const comparePasswordWithHash = (password, hash) =>
  bcrypt.compareSync(password, hash);

module.exports = {
  hashPassword,
  comparePasswordWithHash,
};
