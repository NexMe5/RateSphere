const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};

module.exports = { hashPassword, comparePassword };
