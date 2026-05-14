const repo = require("./tags.repository");
const { slugify } = require("../../utils/slugify");

const getAll = () => repo.findAll();

const getPopular = (limit) => repo.popular(limit);

const upsertMany = async (names) => {
  const tags = [];
  for (const name of names) {
    const slug = slugify(name);
    let tag = await repo.findBySlug(slug);
    if (!tag) tag = await repo.create({ name: name.trim(), slug });
    tags.push(tag);
  }
  return tags;
};

const create = async (name) => {
  const slug = slugify(name);
  const existing = await repo.findBySlug(slug);
  if (existing) throw { status: 409, message: "Bu tag allaqachon mavjud." };
  return repo.create({ name: name.trim(), slug });
};

const remove = async (id) => {
  const existing = await repo.findById(id);
  if (!existing) throw { status: 404, message: "Tag topilmadi." };
  return repo.remove(id);
};

module.exports = { getAll, getPopular, upsertMany, create, remove };
