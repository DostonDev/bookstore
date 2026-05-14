const { PrismaClient } = require("@prisma/client");
const { success, error } = require("../utils/response");

const prisma = new PrismaClient();

// ─── COMMENTS ────────────────────────────────────────────────────────────────

async function getComments(req, res) {
  try {
    const { bookId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { bookId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return success(res, { comments });
  } catch (err) {
    console.error("[getComments]", err);
    return error(res, "Izohlarni olishda xato.");
  }
}

async function addComment(req, res) {
  try {
    const { bookId } = req.params;
    const { text } = req.body;

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return error(res, "Kitob topilmadi.", 404);

    const comment = await prisma.comment.create({
      data: { text, userId: req.user.id, bookId },
      include: { user: { select: { id: true, name: true } } },
    });
    return success(res, { comment }, "Izoh qo'shildi.", 201);
  } catch (err) {
    console.error("[addComment]", err);
    return error(res, "Izoh qo'shishda xato.");
  }
}

async function deleteComment(req, res) {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return error(res, "Izoh topilmadi.", 404);

    const isOwner = comment.userId === req.user.id;
    const isAdmin = req.user.role === "ADMIN";
    if (!isOwner && !isAdmin) return error(res, "Ruxsat yo'q.", 403);

    await prisma.comment.delete({ where: { id } });
    return success(res, null, "Izoh o'chirildi.");
  } catch (err) {
    console.error("[deleteComment]", err);
    return error(res, "Izohni o'chirishda xato.");
  }
}

// ─── RATING ──────────────────────────────────────────────────────────────────

async function rateBook(req, res) {
  try {
    const { bookId } = req.params;
    const { value } = req.body;

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
      average: Math.round((agg._avg.value || 0) * 10) / 10,
      total: agg._count,
    }, "Baho berildi.");
  } catch (err) {
    console.error("[rateBook]", err);
    return error(res, "Baho berishda xato.");
  }
}

async function getBookRating(req, res) {
  try {
    const { bookId } = req.params;

    const agg = await prisma.rating.aggregate({
      where: { bookId },
      _avg: { value: true },
      _count: true,
    });

    let userRating = null;
    if (req.user) {
      userRating = await prisma.rating.findUnique({
        where: { userId_bookId: { userId: req.user.id, bookId } },
      });
    }

    return success(res, {
      average: Math.round((agg._avg.value || 0) * 10) / 10,
      total: agg._count,
      userRating: userRating?.value || null,
    });
  } catch (err) {
    console.error("[getBookRating]", err);
    return error(res, "Bahoni olishda xato.");
  }
}

// ─── LIKES ───────────────────────────────────────────────────────────────────

async function toggleLike(req, res) {
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
      await prisma.book.update({
        where: { id: bookId },
        data: { likeCount: { decrement: 1 } },
      });
      return success(res, { liked: false }, "Like olib tashlandi.");
    }

    await prisma.like.create({ data: { userId, bookId } });
    await prisma.book.update({
      where: { id: bookId },
      data: { likeCount: { increment: 1 } },
    });
    return success(res, { liked: true }, "Like bosildi.");
  } catch (err) {
    console.error("[toggleLike]", err);
    return error(res, "Like bosishda xato.");
  }
}

// ─── BOOKMARKS ───────────────────────────────────────────────────────────────

async function toggleBookmark(req, res) {
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
      return success(res, { saved: false }, "Saqlangan kitobdan olib tashlandi.");
    }

    await prisma.bookmark.create({ data: { userId, bookId } });
    return success(res, { saved: true }, "Kitob saqlandi.");
  } catch (err) {
    console.error("[toggleBookmark]", err);
    return error(res, "Saqlashda xato.");
  }
}

async function getBookmarks(req, res) {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      include: { book: true },
      orderBy: { createdAt: "desc" },
    });
    return success(res, { bookmarks: bookmarks.map((b) => b.book) });
  } catch (err) {
    console.error("[getBookmarks]", err);
    return error(res, "Saqlangan kitoblarni olishda xato.");
  }
}

async function getLikes(req, res) {
  try {
    const likes = await prisma.like.findMany({
      where: { userId: req.user.id },
      include: { book: true },
      orderBy: { createdAt: "desc" },
    });
    return success(res, { likes: likes.map((l) => l.book) });
  } catch (err) {
    console.error("[getLikes]", err);
    return error(res, "Yoqtirilgan kitoblarni olishda xato.");
  }
}

module.exports = {
  getComments,
  addComment,
  deleteComment,
  rateBook,
  getBookRating,
  toggleLike,
  toggleBookmark,
  getBookmarks,
  getLikes,
};
