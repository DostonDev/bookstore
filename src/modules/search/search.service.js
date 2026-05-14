const prisma = require("../../utils/prisma");
const { getPagination, buildMeta } = require("../../utils/pagination");

const search = async (query) => {
  const { q = "", type = "all", sort = "relevance" } = query;
  const { page, limit, skip } = getPagination(query);

  if (!q.trim()) return { results: [], meta: buildMeta(0, page, limit), query: q };

  const term = q.trim();
  const results = [];
  let total = 0;

  const bookWhere = {
    OR: [
      { title: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
    ],
  };

  if (type === "all" || type === "books") {
    const [books, bookCount] = await Promise.all([
      prisma.book.findMany({
        where: bookWhere,
        skip: type === "books" ? skip : 0,
        take: type === "books" ? limit : 6,
        orderBy: sort === "popular" ? { downloadCount: "desc" } : { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true } },
          ratings: { select: { value: true } },
          _count: { select: { ratings: true } },
        },
      }),
      prisma.book.count({ where: bookWhere }),
    ]);

    const formattedBooks = books.map((b) => {
      const avg = b.ratings.length
        ? b.ratings.reduce((s, r) => s + r.value, 0) / b.ratings.length
        : null;
      return { ...b, _avgRating: avg, ratings: undefined, type: "book" };
    });

    results.push(...formattedBooks);
    total += bookCount;
  }

  if (type === "all" || type === "authors") {
    const authorWhere = {
      OR: [
        { name: { contains: term, mode: "insensitive" } },
        { bio: { contains: term, mode: "insensitive" } },
      ],
    };
    const [authors, authorCount] = await Promise.all([
      prisma.author.findMany({
        where: authorWhere,
        skip: type === "authors" ? skip : 0,
        take: type === "authors" ? limit : 4,
        include: { _count: { select: { books: true } } },
      }),
      prisma.author.count({ where: authorWhere }),
    ]);
    results.push(...authors.map((a) => ({ ...a, type: "author" })));
    total += authorCount;
  }

  if (type === "all" || type === "categories") {
    const catWhere = {
      OR: [
        { name: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
      ],
    };
    const [cats, catCount] = await Promise.all([
      prisma.category.findMany({
        where: catWhere,
        take: type === "categories" ? limit : 4,
        include: { _count: { select: { books: true } } },
      }),
      prisma.category.count({ where: catWhere }),
    ]);
    results.push(...cats.map((c) => ({ ...c, type: "category" })));
    total += catCount;
  }

  if (type === "all" || type === "blogs") {
    const blogWhere = {
      status: "PUBLISHED",
      OR: [
        { title: { contains: term, mode: "insensitive" } },
        { excerpt: { contains: term, mode: "insensitive" } },
      ],
    };
    const [blogs, blogCount] = await Promise.all([
      prisma.blog.findMany({
        where: blogWhere,
        take: type === "blogs" ? limit : 4,
        include: { author: { select: { id: true, name: true } } },
      }),
      prisma.blog.count({ where: blogWhere }),
    ]);
    results.push(...blogs.map((b) => ({ ...b, type: "blog" })));
    total += blogCount;
  }

  return { results, meta: buildMeta(total, page, limit), query: term };
};

const autocomplete = async (q) => {
  if (!q || q.trim().length < 2) return [];

  const term = q.trim();

  try {
    const [books, authors] = await Promise.all([
      prisma.book.findMany({
        where: { title: { startsWith: term, mode: "insensitive" } },
        take: 6,
        select: { id: true, title: true, coverUrl: true, price: true },
        orderBy: { downloadCount: "desc" },
      }),
      prisma.author.findMany({
        where: { name: { startsWith: term, mode: "insensitive" } },
        take: 3,
        select: { id: true, name: true, slug: true, avatarUrl: true },
      }),
    ]);

    return [
      ...books.map((b) => ({ ...b, type: "book" })),
      ...authors.map((a) => ({ ...a, type: "author" })),
    ];
  } catch {
    return [];
  }
};

module.exports = { search, autocomplete };
