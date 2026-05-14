const prisma = require("../../utils/prisma");

const findAll = async () => {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { books: true, blogs: true } },
      children: {
        orderBy: { name: "asc" },
        include: { _count: { select: { books: true } } },
      },
    },
  });

  // For parents with children: sum up all children's book counts
  return categories.map((cat) => {
    if (cat.children && cat.children.length > 0) {
      const totalBooks = cat.children.reduce((sum, c) => sum + (c._count?.books || 0), 0);
      return { ...cat, _count: { ...cat._count, books: cat._count.books + totalBooks } };
    }
    return cat;
  });
};

const findById = (id) =>
  prisma.category.findUnique({
    where: { id },
    include: {
      _count: { select: { books: true } },
      children: {
        orderBy: { name: "asc" },
        include: { _count: { select: { books: true } } },
      },
      parent: { select: { id: true, name: true, slug: true } },
    },
  });

const findBySlug = (slug) =>
  prisma.category.findUnique({ where: { slug } });

const create = (data) => prisma.category.create({ data });

const update = (id, data) =>
  prisma.category.update({ where: { id }, data });

const remove = (id) => prisma.category.delete({ where: { id } });

module.exports = { findAll, findById, findBySlug, create, update, remove };
