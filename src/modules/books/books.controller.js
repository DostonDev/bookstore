const service = require("./books.service");
const { success, error, paginated } = require("../../utils/response");

const getAll = async (req, res) => {
  try {
    const { books, meta } = await service.getAll(req.query, req.user?.id);
    return paginated(res, books, meta);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getById = async (req, res) => {
  try {
    const data = await service.getById(req.params.id, req.user?.id);
    return success(res, { book: data });
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getNew = async (req, res) => {
  try {
    const books = await service.getNew(Number(req.query.limit) || 10, req.user?.id);
    return success(res, { books });
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getPopular = async (req, res) => {
  try {
    const books = await service.getPopular(Number(req.query.limit) || 10, req.user?.id);
    return success(res, { books });
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getRelated = async (req, res) => {
  try {
    const books = await service.getRelated(req.params.id, Number(req.query.limit) || 6);
    return success(res, { books });
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const create = async (req, res) => {
  try {
    const pdf = req.files?.pdf?.[0];
    const cover = req.files?.cover?.[0];
    const book = await service.create(req.body, pdf, cover);
    return success(res, { book }, "Kitob qo'shildi.", 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const update = async (req, res) => {
  try {
    const pdf = req.files?.pdf?.[0];
    const cover = req.files?.cover?.[0];
    const book = await service.update(req.params.id, req.body, pdf, cover);
    return success(res, { book }, "Kitob yangilandi.");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const remove = async (req, res) => {
  try {
    await service.remove(req.params.id);
    return success(res, null, "Kitob o'chirildi.");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const download = async (req, res) => {
  try {
    const url = await service.download(req.params.id, req.user.id);
    return success(res, { url }, "Yuklab olish havolasi tayyor.");
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

module.exports = { getAll, getById, getNew, getPopular, getRelated, create, update, remove, download };
