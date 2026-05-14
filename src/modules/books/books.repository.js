const prisma = require("../../utils/prisma");

const buildWhere = (filters = {}) => {
  const where = {};

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.authorId) where.authorId = filters.authorId;
  if (filters.minPrice !== undefined) where.price = { ...where.price, gte: Number(filters.minPrice) };
  if (filters.maxPrice !== undefined) where.price = { ...where.price, lte: Number(filters.maxPrice) };

  if (filters.tagId) {
    where.tags = { some: { tagId: filters.tagId } };
  }

  return where;
};

const buildOrderBy = (sort = "newest") => {
  const map = {
    newest: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
    popular: { downloadCount: "desc" },
    rating: { ratings: { _count: "desc" } },
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
  };
  return map[sort] || map.newest;
};

const findMany = (filters, skip, limit, userId) => {
  const where = buildWhere(filters);
  const orderBy = buildOrderBy(filters.sort);

  return Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, slug: true, avatarUrl: true } },
        tags: { include: { tag: true } },
        _count: { select: { ratings: true, comments: true, likes: true } },
        ratings: { select: { value: true } },
        ...(userId && {
          bookmarks: { where: { userId }, select: { id: true } },
          likes: { where: { userId }, select: { id: true } },
        }),
      },
    }),
    prisma.book.count({ where }),
  ]);
};

const findById = (id, userId) =>
  prisma.book.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      author: { select: { id: true, name: true, slug: true, avatarUrl: true, bio: true } },
      tags: { include: { tag: true } },
      _count: { select: { ratings: true, comments: true, likes: true } },
      ratings: { select: { value: true } },
      ...(userId && {
        bookmarks: { where: { userId }, select: { id: true } },
        likes: { where: { userId }, select: { id: true } },
      }),
    },
  });

const create = (data) =>
  prisma.book.create({
    data,
    include: {
      category: { select: { id: true, name: true } },
      author: { select: { id: true, name: true } },
    },
  });

const update = (id, data) =>
  prisma.book.update({
    where: { id },
    data,
    include: {
      category: { select: { id: true, name: true } },
      author: { select: { id: true, name: true } },
    },
  });

const remove = (id) => prisma.book.delete({ where: { id } });

const findByIdSimple = (id) => prisma.book.findUnique({ where: { id } });

const connectTags = (bookId, tagIds) =>
  prisma.bookTag.createMany({
    data: tagIds.map((tagId) => ({ bookId, tagId })),
    skipDuplicates: true,
  });

const disconnectAllTags = (bookId) =>
  prisma.bookTag.deleteMany({ where: { bookId } });

const findRelated = (excludeId, categoryId, authorId, limit = 6) => {
  const OR = [];
  if (categoryId) OR.push({ categoryId });
  if (authorId) OR.push({ authorId });

  return prisma.book.findMany({
    where: { id: { not: excludeId }, ...(OR.length ? { OR } : {}) },
    take: limit,
    orderBy: { downloadCount: "desc" },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      author: { select: { id: true, name: true, slug: true, avatarUrl: true } },
      tags: { include: { tag: true } },
      _count: { select: { ratings: true, comments: true, likes: true } },
      ratings: { select: { value: true } },
    },
  });
};

const findNew = (limit, userId) =>
  prisma.book.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { id: true, name: true } },
      author: { select: { id: true, name: true } },
      _count: { select: { ratings: true } },
      ratings: { select: { value: true } },
      ...(userId && {
        bookmarks: { where: { userId }, select: { id: true } },
        likes: { where: { userId }, select: { id: true } },
      }),
    },
  });

const findPopular = (limit, userId) =>
  prisma.book.findMany({
    take: limit,
    orderBy: { downloadCount: "desc" },
    include: {
      category: { select: { id: true, name: true } },
      author: { select: { id: true, name: true } },
      _count: { select: { ratings: true } },
      ratings: { select: { value: true } },
      ...(userId && {
        bookmarks: { where: { userId }, select: { id: true } },
        likes: { where: { userId }, select: { id: true } },
      }),
    },
  });

module.exports = {
  findMany,
  findById,
  findByIdSimple,
  findRelated,
  create,
  update,
  remove,
  connectTags,
  disconnectAllTags,
  findNew,
  findPopular,
};
