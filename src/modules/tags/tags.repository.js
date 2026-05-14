const prisma = require("../../utils/prisma");

const findAll = () =>
  prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { books: true } } },
  });

const findById = (id) => prisma.tag.findUnique({ where: { id } });

const findBySlug = (slug) => prisma.tag.findUnique({ where: { slug } });

const findByName = (name) => prisma.tag.findUnique({ where: { name } });

const create = (data) => prisma.tag.create({ data });

const remove = (id) => prisma.tag.delete({ where: { id } });

const popular = async (limit = 20) => {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { books: true } } },
  });
  return tags
    .sort((a, b) => (b._count?.books || 0) - (a._count?.books || 0))
    .slice(0, limit);
};

module.exports = { findAll, findById, findBySlug, findByName, create, remove, popular };
