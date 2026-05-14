const service = require("./blogs.service");
const { success, error, paginated } = require("../../utils/response");

const getAll = async (req, res) => {
  try {
    const { blogs, meta } = await service.getAll(req.query);
    return paginated(res, blogs, meta);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const { blogs, meta } = await service.getAllAdmin(req.query);
    return paginated(res, blogs, meta);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getBySlug = async (req, res) => {
  try {
    const data = await service.getBySlug(req.params.slug);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const create = async (req, res) => {
  try {
    const data = await service.create(req.body, req.file);
    return success(res, data, "Blog yaratildi.", 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body, req.file);
    return success(res, data, "Blog yangilandi.");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const remove = async (req, res) => {
  try {
    await service.remove(req.params.id);
    return success(res, null, "Blog o'chirildi.");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

module.exports = { getAll, getAllAdmin, getBySlug, create, update, remove };
