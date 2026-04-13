const { body } = require('express-validator');

const registerValidator = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be 20–60 characters'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .matches(/[A-Z]/).withMessage('Password must include one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must include one special character'),
  body('address')
    .optional()
    .isLength({ max: 400 })
    .withMessage('Address max 400 characters'),
];

const loginValidator = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password required'),
];

const updatePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .matches(/[A-Z]/)
    .matches(/[!@#$%^&*(),.?":{}|<>]/),
];

module.exports = { registerValidator, loginValidator, updatePasswordValidator };
