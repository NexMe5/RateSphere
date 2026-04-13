const storeService = require('../services/store.service');
const { success, error } = require('../utils/apiResponse');

const getStores = async (req, res) => {
  try {
    const stores = await storeService.getAllStores({ ...req.query, userId: req.user?.id });
    return success(res, stores);
  } catch (err) {
    return error(res, err.message);
  }
};

const submitRating = async (req, res) => {
  try {
    const result = await storeService.submitRating({
      userId: req.user.id,
      storeId: req.params.storeId,
      rating: Number(req.body.rating),
    });
    return success(res, result, 'Rating submitted');
  } catch (err) {
    return error(res, err.message);
  }
};

const getOwnerDashboard = async (req, res) => {
  try {
    const data = await storeService.getOwnerDashboard(req.user.id);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, 404);
  }
};

const addUnclaimedStore = async (req, res) => {
  try {
    const data = await storeService.addUnclaimedStore(req.body);
    return success(res, data, 'Unclaimed store added/fetched successfully', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = { getStores, submitRating, getOwnerDashboard, addUnclaimedStore };
