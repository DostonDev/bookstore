const service = require("./tags.service");
const { success, error } = require("../../utils/response");

const getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    return success(res, data);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getPopular = async (req, res) => {
  try {
    const data = await service.getPopular(Number(req.query.limit) || 20);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const create = async (req, res) => {
  try {
    const data = await service.create(req.body.name);
    return success(res, data, "Tag yaratildi.", 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const remove = async (req, res) => {
  try {
    await service.remove(req.params.id);
    return success(res, null, "Tag o'chirildi.");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

module.exports = { getAll, getPopular, create, remove };
