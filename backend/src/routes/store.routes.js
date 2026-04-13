const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

router.get('/', authenticate, storeController.getStores);
router.post('/unclaimed', authenticate, authorizeRoles('normal_user'), storeController.addUnclaimedStore);
router.post('/:storeId/rate', authenticate, authorizeRoles('normal_user'), storeController.submitRating);
router.get('/owner/dashboard', authenticate, authorizeRoles('store_owner'), storeController.getOwnerDashboard);

module.exports = router;
