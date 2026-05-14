const repo = require("./blogs.repository");
const tagService = require("../tags/tags.service");
const { uniqueSlug } = require("../../utils/slugify");
const { uploadFile, deleteFile } = require("../../utils/supabase");
const { getPagination, buildMeta } = require("../../utils/pagination");

const estimateReadingTime = (content) => {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
};

const formatBlog = (blog) => ({
  ...blog,
  tags: blog.tags?.map((bt) => bt.tag) || [],
});

const getAll = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const where = { status: "PUBLISHED" };
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.authorId) where.authorId = query.authorId;
  if (query.tag) where.tags = { some: { tag: { slug: query.tag } } };

  const [blogs, total] = await repo.findMany(where, skip, limit);
  return { blogs: blogs.map(formatBlog), meta: buildMeta(total, page, limit) };
};

const getAllAdmin = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const where = {};
  if (query.status) where.status = query.status;

  const [blogs, total] = await repo.findMany(where, skip, limit);
  return { blogs: blogs.map(formatBlog), meta: buildMeta(total, page, limit) };
};

const getBySlug = async (slug) => {
  const blog = await repo.findBySlug(slug);
  if (!blog) throw { status: 404, message: "Blog topilmadi." };
  return formatBlog(blog);
};

const create = async (body, imageFile) => {
  const slug = await uniqueSlug(body.title, (s) => repo.findBySlug(s));
  let featuredImage = null;
  if (imageFile) {
    const { url } = await uploadFile(imageFile.buffer, imageFile.originalname, "blogs");
    featuredImage = url;
  }

  const readingTime = estimateReadingTime(body.content || "");

  const data = {
    title: body.title,
    slug,
    content: body.content,
    excerpt: body.excerpt,
    metaTitle: body.metaTitle,
    metaDescription: body.metaDescription,
    featuredImage,
    readingTime,
    status: body.status || "DRAFT",
    ...(body.authorId && { authorId: body.authorId }),
    ...(body.categoryId && { categoryId: body.categoryId }),
  };

  const blog = await repo.create(data);

  if (body.tags) {
    const tagNames = Array.isArray(body.tags) ? body.tags : body.tags.split(",").map((t) => t.trim());
    const tagObjs = await tagService.upsertMany(tagNames.filter(Boolean));
    if (tagObjs.length) await repo.connectTags(blog.id, tagObjs.map((t) => t.id));
  }

  return formatBlog(blog);
};

const update = async (id, body, imageFile) => {
  const existing = await repo.findById(id);
  if (!existing) throw { status: 404, message: "Blog topilmadi." };

  const data = {};
  if (body.title) data.title = body.title;
  if (body.content) {
    data.content = body.content;
    data.readingTime = estimateReadingTime(body.content);
  }
  if (body.excerpt !== undefined) data.excerpt = body.excerpt;
  if (body.metaTitle !== undefined) data.metaTitle = body.metaTitle;
  if (body.metaDescription !== undefined) data.metaDescription = body.metaDescription;
  if (body.status) data.status = body.status;
  if (body.authorId !== undefined) data.authorId = body.authorId || null;
  if (body.categoryId !== undefined) data.categoryId = body.categoryId || null;

  if (imageFile) {
    if (existing.featuredImage) {
      const path = existing.featuredImage.split(`/${process.env.SUPABASE_BUCKET_NAME}/`)[1];
      if (path) await deleteFile(path).catch(() => {});
    }
    const { url } = await uploadFile(imageFile.buffer, imageFile.originalname, "blogs");
    data.featuredImage = url;
  }

  const blog = await repo.update(id, data);

  if (body.tags !== undefined) {
    await repo.disconnectAllTags(id);
    if (body.tags) {
      const tagNames = Array.isArray(body.tags) ? body.tags : body.tags.split(",").map((t) => t.trim());
      const tagObjs = await tagService.upsertMany(tagNames.filter(Boolean));
      if (tagObjs.length) await repo.connectTags(id, tagObjs.map((t) => t.id));
    }
  }

  return formatBlog(blog);
};

const remove = async (id) => {
  const existing = await repo.findById(id);
  if (!existing) throw { status: 404, message: "Blog topilmadi." };
  if (existing.featuredImage) {
    const path = existing.featuredImage.split(`/${process.env.SUPABASE_BUCKET_NAME}/`)[1];
    if (path) await deleteFile(path).catch(() => {});
  }
  return repo.remove(id);
};

module.exports = { getAll, getAllAdmin, getBySlug, create, update, remove };
