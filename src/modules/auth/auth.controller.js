const service = require("./auth.service");
const { success, error } = require("../../utils/response");

const register = async (req, res) => {
  try {
    const result = await service.register(req.body);
    return success(res, result, "Muvaffaqiyatli ro'yxatdan o'tdingiz.", 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const login = async (req, res) => {
  try {
    const result = await service.login(req.body);
    return success(res, result, "Muvaffaqiyatli kirish.");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getMe = async (req, res) => {
  return success(res, { user: req.user }, "Profil ma'lumotlari.");
};

module.exports = { register, login, getMe };
