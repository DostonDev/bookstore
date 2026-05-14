const service = require("./categories.service");
const { success, error } = require("../../utils/response");

const getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    return success(res, data);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getById = async (req, res) => {
  try {
    const data = await service.getById(req.params.id);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const create = async (req, res) => {
  try {
    const data = await service.create(req.body, req.file);
    return success(res, data, "Kategoriya yaratildi.", 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body, req.file);
    return success(res, data, "Kategoriya yangilandi.");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const remove = async (req, res) => {
  try {
    await service.remove(req.params.id);
    return success(res, null, "Kategoriya o'chirildi.");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

module.exports = { getAll, getById, create, update, remove };
