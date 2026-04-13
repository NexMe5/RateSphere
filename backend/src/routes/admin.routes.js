const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const adminGuard = [authenticate, authorizeRoles('admin')];

router.get('/dashboard', ...adminGuard, adminController.getDashboard);
router.post('/users', ...adminGuard, adminController.addUser);
router.get('/users', ...adminGuard, adminController.getUsers);
router.get('/users/:id', ...adminGuard, adminController.getUserDetails);
router.post('/stores', ...adminGuard, adminController.addStore);
router.get('/stores', ...adminGuard, adminController.getStores);

module.exports = router;
