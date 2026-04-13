const authService = require('../services/auth.service');
const { success, error } = require('../utils/apiResponse');

const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    return success(res, user, 'Registered successfully', 201);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    return success(res, result, 'Login successful');
  } catch (err) {
    return error(res, err.message, 401);
  }
};

const updatePassword = async (req, res) => {
  try {
    await authService.updatePassword(req.user.id, req.body);
    return success(res, {}, 'Password updated successfully');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const getMe = async (req, res) => {
  return success(res, req.user, 'Authenticated user');
};

const getProfile = async (req, res) => {
  try {
    const profileData = await authService.getProfileData(req.user.id);
    return success(res, profileData, 'Profile fetched successfully');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

module.exports = { register, login, updatePassword, getMe, getProfile };
