const { error } = require('../utils/apiResponse');

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return error(res, 'Forbidden: Insufficient permissions', 403);
    }
    next();
  };
};

module.exports = { authorizeRoles };
