const repo = require("./books.repository");
const tagService = require("../tags/tags.service");
const { uploadFile, deleteFile, createSignedUrl } = require("../../utils/supabase");
const { getPagination, buildMeta } = require("../../utils/pagination");

const formatBook = (book) => {
  if (!book) return null;
  const ratings = book.ratings || [];
  const avgRating = ratings.length
    ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
    : null;

  return {
    ...book,
    tags: book.tags?.map((bt) => bt.tag) || [],
    _avgRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null,
    isBookmarked: book.bookmarks?.length > 0,
    isLiked: book.likes?.length > 0,
    bookmarks: undefined,
    likes: undefined,
    ratings: undefined,
  };
};

const getAll = async (query, userId) => {
  const { page, limit, skip } = getPagination(query);
  const [books, total] = await repo.findMany(query, skip, limit, userId);
  return {
    books: books.map(formatBook),
    meta: buildMeta(total, page, limit),
  };
};

const getById = async (id, userId) => {
  const book = await repo.findById(id, userId);
  if (!book) throw { status: 404, message: "Kitob topilmadi." };
  return formatBook(book);
};

const getNew = async (limit = 10, userId) => {
  const books = await repo.findNew(limit, userId);
  return books.map(formatBook);
};

const getPopular = async (limit = 10, userId) => {
  const books = await repo.findPopular(limit, userId);
  return books.map(formatBook);
};

const create = async ({ title, description, price, categoryId, authorId, tags }, pdfFile, coverFile) => {
  if (!pdfFile) throw { status: 400, message: "PDF fayl yuklanmagan." };

  const { url: pdfUrl } = await uploadFile(pdfFile.buffer, pdfFile.originalname, "pdfs");
  let coverUrl = null;
  if (coverFile) {
    const { url } = await uploadFile(coverFile.buffer, coverFile.originalname, "covers");
    coverUrl = url;
  }

  const book = await repo.create({
    title,
    description,
    price: parseFloat(price),
    pdfUrl,
    coverUrl,
    ...(categoryId && { categoryId }),
    ...(authorId && { authorId }),
  });

  if (tags) {
    const tagNames = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim());
    const tagObjs = await tagService.upsertMany(tagNames.filter(Boolean));
    if (tagObjs.length) await repo.connectTags(book.id, tagObjs.map((t) => t.id));
  }

  return book;
};

const update = async (id, body, pdfFile, coverFile) => {
  const existing = await repo.findByIdSimple(id);
  if (!existing) throw { status: 404, message: "Kitob topilmadi." };

  const data = {};
  if (body.title) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.price) data.price = parseFloat(body.price);
  if (body.categoryId !== undefined) data.categoryId = body.categoryId || null;
  if (body.authorId !== undefined) data.authorId = body.authorId || null;

  if (pdfFile) {
    const oldPath = existing.pdfUrl.split(`/${process.env.SUPABASE_BUCKET_NAME}/`)[1];
    if (oldPath) await deleteFile(oldPath).catch(() => {});
    const { url } = await uploadFile(pdfFile.buffer, pdfFile.originalname, "pdfs");
    data.pdfUrl = url;
  }

  if (coverFile) {
    if (existing.coverUrl) {
      const oldPath = existing.coverUrl.split(`/${process.env.SUPABASE_BUCKET_NAME}/`)[1];
      if (oldPath) await deleteFile(oldPath).catch(() => {});
    }
    const { url } = await uploadFile(coverFile.buffer, coverFile.originalname, "covers");
    data.coverUrl = url;
  }

  const book = await repo.update(id, data);

  if (body.tags !== undefined) {
    await repo.disconnectAllTags(id);
    if (body.tags) {
      const tagNames = Array.isArray(body.tags) ? body.tags : body.tags.split(",").map((t) => t.trim());
      const tagObjs = await tagService.upsertMany(tagNames.filter(Boolean));
      if (tagObjs.length) await repo.connectTags(id, tagObjs.map((t) => t.id));
    }
  }

  return book;
};

const remove = async (id) => {
  const existing = await repo.findByIdSimple(id);
  if (!existing) throw { status: 404, message: "Kitob topilmadi." };

  const pdfPath = existing.pdfUrl.split(`/${process.env.SUPABASE_BUCKET_NAME}/`)[1];
  if (pdfPath) await deleteFile(pdfPath).catch(() => {});
  if (existing.coverUrl) {
    const coverPath = existing.coverUrl.split(`/${process.env.SUPABASE_BUCKET_NAME}/`)[1];
    if (coverPath) await deleteFile(coverPath).catch(() => {});
  }

  return repo.remove(id);
};

const download = async (id, userId) => {
  const book = await repo.findByIdSimple(id);
  if (!book) throw { status: 404, message: "Kitob topilmadi." };

  const urlParts = book.pdfUrl.split(`/${process.env.SUPABASE_BUCKET_NAME}/`);
  const filePath = urlParts[1];
  const signedUrl = await createSignedUrl(filePath, 60);

  const prisma = require("../../utils/prisma");
  await Promise.all([
    prisma.book.update({ where: { id }, data: { downloadCount: { increment: 1 } } }),
    prisma.downloadHistory.create({ data: { userId, bookId: id } }),
  ]);

  return signedUrl;
};

const getRelated = async (id, limit = 6) => {
  const book = await repo.findByIdSimple(id);
  if (!book) throw { status: 404, message: "Kitob topilmadi." };
  const books = await repo.findRelated(id, book.categoryId, book.authorId, limit);
  return books.map(formatBook);
};

module.exports = { getAll, getById, getNew, getPopular, getRelated, create, update, remove, download };
