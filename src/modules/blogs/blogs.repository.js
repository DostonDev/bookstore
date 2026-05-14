const prisma = require("../../utils/prisma");

const include = {
  author: { select: { id: true, name: true, slug: true, avatarUrl: true } },
  category: { select: { id: true, name: true, slug: true } },
  tags: { include: { tag: true } },
};

const findMany = (where, skip, limit, orderBy = { createdAt: "desc" }) =>
  Promise.all([
    prisma.blog.findMany({ where, skip, take: limit, orderBy, include }),
    prisma.blog.count({ where }),
  ]);

const findBySlug = (slug) =>
  prisma.blog.findUnique({ where: { slug }, include });

const findById = (id) =>
  prisma.blog.findUnique({ where: { id }, include });

const create = (data) => prisma.blog.create({ data, include });

const update = (id, data) => prisma.blog.update({ where: { id }, data, include });

const remove = (id) => prisma.blog.delete({ where: { id } });

const connectTags = (blogId, tagIds) =>
  prisma.blogTag.createMany({
    data: tagIds.map((tagId) => ({ blogId, tagId })),
    skipDuplicates: true,
  });

const disconnectAllTags = (blogId) =>
  prisma.blogTag.deleteMany({ where: { blogId } });

module.exports = { findMany, findBySlug, findById, create, update, remove, connectTags, disconnectAllTags };
