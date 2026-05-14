const repo = require("./authors.repository");
const { uniqueSlug } = require("../../utils/slugify");
const { uploadFile, deleteFile } = require("../../utils/supabase");

const getAll = (query) => repo.findAll(query);

const getBySlug = async (slug) => {
  const author = await repo.findBySlug(slug);
  if (!author) throw { status: 404, message: "Muallif topilmadi." };
  return author;
};

const getById = async (id) => {
  const author = await repo.findById(id);
  if (!author) throw { status: 404, message: "Muallif topilmadi." };
  return author;
};

const create = async (body, avatarFile) => {
  const slug = await uniqueSlug(body.name, (s) => repo.findBySlugOnly(s));
  let avatarUrl = null;
  if (avatarFile) {
    const { url } = await uploadFile(avatarFile.buffer, avatarFile.originalname, "avatars");
    avatarUrl = url;
  }
  return repo.create({ ...body, slug, avatarUrl });
};

const update = async (id, body, avatarFile) => {
  const existing = await repo.findById(id);
  if (!existing) throw { status: 404, message: "Muallif topilmadi." };

  const data = { ...body };
  if (avatarFile) {
    if (existing.avatarUrl) {
      const path = existing.avatarUrl.split(`/${process.env.SUPABASE_BUCKET_NAME}/`)[1];
      if (path) await deleteFile(path).catch(() => {});
    }
    const { url } = await uploadFile(avatarFile.buffer, avatarFile.originalname, "avatars");
    data.avatarUrl = url;
  }

  return repo.update(id, data);
};

const remove = async (id) => {
  const existing = await repo.findById(id);
  if (!existing) throw { status: 404, message: "Muallif topilmadi." };
  if (existing.avatarUrl) {
    const path = existing.avatarUrl.split(`/${process.env.SUPABASE_BUCKET_NAME}/`)[1];
    if (path) await deleteFile(path).catch(() => {});
  }
  return repo.remove(id);
};

module.exports = { getAll, getBySlug, getById, create, update, remove };
