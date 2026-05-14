const service = require("./authors.service");
const { success, error, paginated } = require("../../utils/response");
const { buildMeta } = require("../../utils/pagination");

const getAll = async (req, res) => {
  try {
    const { authors, total, page, limit } = await service.getAll(req.query);
    return paginated(res, authors, buildMeta(total, page, limit));
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
    return success(res, data, "Muallif yaratildi.", 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body, req.file);
    return success(res, data, "Muallif yangilandi.");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const remove = async (req, res) => {
  try {
    await service.remove(req.params.id);
    return success(res, null, "Muallif o'chirildi.");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

module.exports = { getAll, getBySlug, create, update, remove };
