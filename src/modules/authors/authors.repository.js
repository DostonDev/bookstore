const prisma = require("../../utils/prisma");
const { getPagination } = require("../../utils/pagination");

const findAll = (query = {}) => {
  const { page, limit, skip } = getPagination(query);
  return Promise.all([
    prisma.author.findMany({
      skip,
      take: limit,
      orderBy: { name: "asc" },
      include: { _count: { select: { books: true } } },
    }),
    prisma.author.count(),
  ]).then(([authors, total]) => ({ authors, total, page, limit }));
};

const findById = (id) =>
  prisma.author.findUnique({
    where: { id },
    include: {
      books: { take: 12, orderBy: { createdAt: "desc" } },
      _count: { select: { books: true } },
    },
  });

const findBySlug = (slug) =>
  prisma.author.findUnique({
    where: { slug },
    include: {
      books: { take: 12, orderBy: { createdAt: "desc" } },
      _count: { select: { books: true } },
    },
  });

const findBySlugOnly = (slug) => prisma.author.findUnique({ where: { slug } });

const create = (data) => prisma.author.create({ data });

const update = (id, data) => prisma.author.update({ where: { id }, data });

const remove = (id) => prisma.author.delete({ where: { id } });

module.exports = { findAll, findById, findBySlug, findBySlugOnly, create, update, remove };
