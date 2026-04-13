const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { registerValidator, loginValidator, updatePasswordValidator } = require('../validators/auth.validator');
const { validate } = require('../middlewares/validate.middleware');

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.get('/me', authenticate, authController.getMe);
router.get('/profile', authenticate, authController.getProfile);
router.put('/password', authenticate, updatePasswordValidator, validate, authController.updatePassword);

module.exports = router;
