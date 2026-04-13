const adminService = require('../services/admin.service');
const { success, error } = require('../utils/apiResponse');

const getDashboard = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    return success(res, stats);
  } catch (err) {
    return error(res, err.message);
  }
};

const addUser = async (req, res) => {
  try {
    const user = await adminService.addUser(req.body);
    return success(res, user, 'User created', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

const addStore = async (req, res) => {
  try {
    const store = await adminService.addStore(req.body);
    return success(res, store, 'Store created', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await adminService.getUsers(req.query);
    return success(res, users);
  } catch (err) {
    return error(res, err.message);
  }
};

const getStores = async (req, res) => {
  try {
    const stores = await adminService.getStores(req.query);
    return success(res, stores);
  } catch (err) {
    return error(res, err.message);
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await adminService.getUserDetails(req.params.id);
    return success(res, user);
  } catch (err) {
    return error(res, err.message, 404);
  }
};

module.exports = { getDashboard, addUser, addStore, getUsers, getStores, getUserDetails };
