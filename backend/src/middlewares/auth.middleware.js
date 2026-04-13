const { verifyToken } = require('../utils/generateToken');
const { error } = require('../utils/apiResponse');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Unauthorized: No token provided', 401);
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, 'Unauthorized: Invalid token', 401);
  }
};

module.exports = { authenticate };
