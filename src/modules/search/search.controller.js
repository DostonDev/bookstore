const service = require("./search.service");
const { success, error, paginated } = require("../../utils/response");

const search = async (req, res) => {
  try {
    const { results, meta, query } = await service.search(req.query);
    return paginated(res, results, meta, `"${query}" bo'yicha natijalar`);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const autocomplete = async (req, res) => {
  try {
    const data = await service.autocomplete(req.query.q);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

module.exports = { search, autocomplete };
