const prisma = require("../../utils/prisma");
const { success, error } = require("../../utils/response");

// COMMENTS
const getComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { bookId: req.params.bookId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return success(res, { comments });
  } catch (err) {
    return error(res, "Izohlarni olishda xato.");
  }
};

const addComment = async (req, res) => {
  try {
    const book = await prisma.book.findUnique({ where: { id: req.params.bookId } });
    if (!book) return error(res, "Kitob topilmadi.", 404);

    const comment = await prisma.comment.create({
      data: { text: req.body.text, userId: req.user.id, bookId: req.params.bookId },
      include: { user: { select: { id: true, name: true } } },
    });
    return success(res, { comment }, "Izoh qo'shildi.", 201);
  } catch (err) {
    return error(res, "Izoh qo'shishda xato.");
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id } });
    if (!comment) return error(res, "Izoh topilmadi.", 404);
    if (comment.userId !== req.user.id && req.user.role !== "ADMIN") return error(res, "Ruxsat yo'q.", 403);
    await prisma.comment.delete({ where: { id: req.params.id } });
    return success(res, null, "Izoh o'chirildi.");
  } catch (err) {
    return error(res, "Izohni o'chirishda xato.");
  }
};

// RATINGS
const rateBook = async (req, res) => {
  try {
    const { value } = req.body;
    const { bookId } = req.params;

    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return error(res, "Baho 1 dan 5 gacha bo'lishi kerak.", 400);
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return error(res, "Kitob topilmadi.", 404);

    const rating = await prisma.rating.upsert({
      where: { userId_bookId: { userId: req.user.id, bookId } },
      update: { value },
      create: { value, userId: req.user.id, bookId },
    });

    const agg = await prisma.rating.aggregate({
      where: { bookId },
      _avg: { value: true },
      _count: true,
    });

    return success(res, {
      rating,
      average: parseFloat((agg._avg.value || 0).toFixed(1)),
      total: agg._count,
    }, "Baho berildi.");
  } catch (err) {
    return error(res, "Baho berishda xato.");
  }
};

const getBookRating = async (req, res) => {
  try {
    const { bookId } = req.params;
    const agg = await prisma.rating.aggregate({
      where: { bookId },
      _avg: { value: true },
      _count: true,
    });

    let userRating = null;
    if (req.user) {
      const r = await prisma.rating.findUnique({
        where: { userId_bookId: { userId: req.user.id, bookId } },
      });
      userRating = r?.value || null;
    }

    return success(res, {
      average: parseFloat((agg._avg.value || 0).toFixed(1)),
      total: agg._count,
      userRating,
    });
  } catch (err) {
    return error(res, "Bahoni olishda xato.");
  }
};

// LIKES
const toggleLike = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return error(res, "Kitob topilmadi.", 404);

    const existing = await prisma.like.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { userId_bookId: { userId, bookId } } });
      await prisma.book.update({ where: { id: bookId }, data: { likeCount: { decrement: 1 } } });
      return success(res, { liked: false }, "Like olib tashlandi.");
    }

    await prisma.like.create({ data: { userId, bookId } });
    await prisma.book.update({ where: { id: bookId }, data: { likeCount: { increment: 1 } } });
    return success(res, { liked: true }, "Like bosildi.");
  } catch (err) {
    return error(res, "Like bosishda xato.");
  }
};

// BOOKMARKS
const toggleBookmark = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return error(res, "Kitob topilmadi.", 404);

    const existing = await prisma.bookmark.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { userId_bookId: { userId, bookId } } });
      return success(res, { saved: false }, "Saqlanganlardan olib tashlandi.");
    }

    await prisma.bookmark.create({ data: { userId, bookId } });
    return success(res, { saved: true }, "Kitob saqlandi.");
  } catch (err) {
    return error(res, "Saqlashda xato.");
  }
};

const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      include: {
        book: {
          include: {
            category: { select: { id: true, name: true } },
            author: { select: { id: true, name: true } },
            ratings: { select: { value: true } },
            _count: { select: { ratings: true } },
            bookmarks: { where: { userId: req.user.id }, select: { id: true } },
            likes: { where: { userId: req.user.id }, select: { id: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return success(res, {
      bookmarks: bookmarks.map((b) => {
        const { bookmarks: bm, likes, ratings, ...rest } = b.book;
        const avgRating = ratings?.length
          ? ratings.reduce((s, r) => s + r.value, 0) / ratings.length
          : null;
        return {
          ...rest,
          _avgRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null,
          isBookmarked: true,
          isLiked: likes?.length > 0,
        };
      }),
    });
  } catch (err) {
    return error(res, "Saqlangan kitoblarni olishda xato.");
  }
};

const getLikes = async (req, res) => {
  try {
    const likes = await prisma.like.findMany({
      where: { userId: req.user.id },
      include: {
        book: {
          include: {
            category: { select: { id: true, name: true } },
            author: { select: { id: true, name: true } },
            ratings: { select: { value: true } },
            _count: { select: { ratings: true } },
            bookmarks: { where: { userId: req.user.id }, select: { id: true } },
            likes: { where: { userId: req.user.id }, select: { id: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return success(res, {
      likes: likes.map((l) => {
        const { bookmarks, likes: lk, ratings, ...rest } = l.book;
        const avgRating = ratings?.length
          ? ratings.reduce((s, r) => s + r.value, 0) / ratings.length
          : null;
        return {
          ...rest,
          _avgRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null,
          isLiked: true,
          isBookmarked: bookmarks?.length > 0,
        };
      }),
    });
  } catch (err) {
    return error(res, "Yoqtirilgan kitoblarni olishda xato.");
  }
};

module.exports = {
  getComments, addComment, deleteComment,
  rateBook, getBookRating,
  toggleLike,
  toggleBookmark, getBookmarks,
  getLikes,
};
