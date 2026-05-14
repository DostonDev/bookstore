const repo = require("./categories.repository");
const { uniqueSlug } = require("../../utils/slugify");
const { uploadFile, deleteFile } = require("../../utils/supabase");

const getAll = () => repo.findAll();

const getById = async (id) => {
  const cat = await repo.findById(id);
  if (!cat) throw { status: 404, message: "Kategoriya topilmadi." };
  return cat;
};

const create = async ({ name, description, parentId }, imageFile) => {
  const slug = await uniqueSlug(name, (s) => repo.findBySlug(s));
  let imageUrl = null;
  if (imageFile) {
    const { url } = await uploadFile(imageFile.buffer, imageFile.originalname, "categories");
    imageUrl = url;
  }
  return repo.create({ name, slug, description, imageUrl, parentId: parentId || null });
};

const update = async (id, { name, description, parentId }, imageFile) => {
  const existing = await repo.findById(id);
  if (!existing) throw { status: 404, message: "Kategoriya topilmadi." };

  const data = {};
  if (name && name !== existing.name) {
    data.name = name;
    data.slug = await uniqueSlug(name, (s) => repo.findBySlug(s));
  }
  if (description !== undefined) data.description = description;
  if (parentId !== undefined) data.parentId = parentId || null;

  if (imageFile) {
    if (existing.imageUrl) {
      const oldPath = existing.imageUrl.split(`/${process.env.SUPABASE_BUCKET_NAME}/`)[1];
      if (oldPath) await deleteFile(oldPath).catch(() => {});
    }
    const { url } = await uploadFile(imageFile.buffer, imageFile.originalname, "categories");
    data.imageUrl = url;
  }

  return repo.update(id, data);
};

const remove = async (id) => {
  const existing = await repo.findById(id);
  if (!existing) throw { status: 404, message: "Kategoriya topilmadi." };
  if (existing.imageUrl) {
    const path = existing.imageUrl.split(`/${process.env.SUPABASE_BUCKET_NAME}/`)[1];
    if (path) await deleteFile(path).catch(() => {});
  }
  return repo.remove(id);
};

module.exports = { getAll, getById, create, update, remove };
