const generateOtpNumber = () =>
  (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString();

module.exports = {
  generateOtpNumber,
};
