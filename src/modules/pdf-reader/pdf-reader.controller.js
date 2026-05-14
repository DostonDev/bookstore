const service = require("./pdf-reader.service");
const { success, error } = require("../../utils/response");

const getReadUrl = async (req, res) => {
  try {
    const data = await service.getReadUrl(req.params.bookId, req.user.id);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const updateProgress = async (req, res) => {
  try {
    const data = await service.updateProgress(req.user.id, req.params.bookId, req.body);
    return success(res, data, "O'qish jarayoni saqlandi.");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getUserProgress = async (req, res) => {
  try {
    const data = await service.getUserProgress(req.user.id);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getProgress = async (req, res) => {
  try {
    const data = await service.getProgress(req.user.id, req.params.bookId);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

module.exports = { getReadUrl, updateProgress, getUserProgress, getProgress };
