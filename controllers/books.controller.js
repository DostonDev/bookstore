const { PrismaClient } = require("@prisma/client");
const { uploadFile, deleteFile, createSignedUrl } = require("../utils/supabase");
const { success, error } = require("../utils/response");

const prisma = new PrismaClient();

async function getAllBooks(req, res) {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const userId = req.user?.id || null;

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true } },
          _count: { select: { ratings: true } },
          ...(userId && {
            likes: { where: { userId }, select: { id: true } },
            bookmarks: { where: { userId }, select: { id: true } },
          }),
        },
      }),
      prisma.book.count({ where }),
    ]);

    const enriched = books.map((b) => {
      const { likes, bookmarks, ...rest } = b;
      return {
        ...rest,
        isLiked: userId ? (likes?.length ?? 0) > 0 : false,
        isBookmarked: userId ? (bookmarks?.length ?? 0) > 0 : false,
      };
    });

    return success(res, {
      books: enriched,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error("[getAllBooks]", err);
    return error(res, "Kitoblarni olishda xato.");
  }
}

async function getBookById(req, res) {
  try {
    const userId = req.user?.id || null;

    const book = await prisma.book.findUnique({
      where: { id: req.params.id },
      include: {
        author: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true } },
        tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
        _count: { select: { ratings: true } },
        ratings: { select: { value: true } },
        ...(userId && {
          likes: { where: { userId }, select: { id: true } },
          bookmarks: { where: { userId }, select: { id: true } },
          orders: {
            where: { userId, status: "PAID" },
            select: { id: true },
          },
        }),
      },
    });

    if (!book) return error(res, "Kitob topilmadi.", 404);

    const avgRating =
      book.ratings.length > 0
        ? book.ratings.reduce((s, r) => s + r.value, 0) / book.ratings.length
        : null;

    const { likes, bookmarks, orders, ratings, tags, ...rest } = book;

    return success(res, {
      book: {
        ...rest,
        tags: tags.map((bt) => bt.tag),
        _avgRating: avgRating,
        isLiked: userId ? (likes?.length ?? 0) > 0 : false,
        isBookmarked: userId ? (bookmarks?.length ?? 0) > 0 : false,
        hasPurchased: userId ? (orders?.length ?? 0) > 0 : false,
      },
    });
  } catch (err) {
    console.error("[getBookById]", err);
    return error(res, "Kitobni olishda xato.");
  }
}

async function createBook(req, res) {
  try {
    const { title, description, price } = req.body;

    const pdfFile = req.files?.pdf?.[0];
    const coverFile = req.files?.cover?.[0];

    if (!pdfFile) {
      return error(res, "PDF fayl yuklanmagan.", 400);
    }

    const { url: pdfUrl } = await uploadFile(
      pdfFile.buffer,
      pdfFile.originalname,
      "pdfs"
    );

    let coverUrl = null;
    if (coverFile) {
      const { url } = await uploadFile(
        coverFile.buffer,
        coverFile.originalname,
        "covers"
      );
      coverUrl = url;
    }

    const book = await prisma.book.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        pdfUrl,
        coverUrl,
      },
    });

    return success(res, { book }, "Kitob muvaffaqiyatli qo'shildi.", 201);
  } catch (err) {
    console.error("[createBook]", err);
    return error(res, "Kitob qo'shishda xato.");
  }
}

async function updateBook(req, res) {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;

    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) return error(res, "Kitob topilmadi.", 404);

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price) updateData.price = parseFloat(price);

    const pdfFile = req.files?.pdf?.[0];
    if (pdfFile) {
      const oldPath = existing.pdfUrl.split("/").slice(-2).join("/");
      try {
        await deleteFile(oldPath);
      } catch (_) {}
      const { url } = await uploadFile(
        pdfFile.buffer,
        pdfFile.originalname,
        "pdfs"
      );
      updateData.pdfUrl = url;
    }

    const coverFile = req.files?.cover?.[0];
    if (coverFile) {
      if (existing.coverUrl) {
        const oldCoverPath = existing.coverUrl.split("/").slice(-2).join("/");
        try {
          await deleteFile(oldCoverPath);
        } catch (_) {}
      }
      const { url } = await uploadFile(
        coverFile.buffer,
        coverFile.originalname,
        "covers"
      );
      updateData.coverUrl = url;
    }

    const book = await prisma.book.update({ where: { id }, data: updateData });

    return success(res, { book }, "Kitob muvaffaqiyatli yangilandi.");
  } catch (err) {
    console.error("[updateBook]", err);
    return error(res, "Kitobni yangilashda xato.");
  }
}

async function deleteBook(req, res) {
  try {
    const { id } = req.params;

    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) return error(res, "Kitob topilmadi.", 404);

    await prisma.order.deleteMany({ where: { bookId: id } });

    const pdfPath = existing.pdfUrl.split("/").slice(-2).join("/");
    try {
      await deleteFile(pdfPath);
    } catch (_) {}

    if (existing.coverUrl) {
      const coverPath = existing.coverUrl.split("/").slice(-2).join("/");
      try {
        await deleteFile(coverPath);
      } catch (_) {}
    }

    await prisma.book.delete({ where: { id } });

    return success(res, null, "Kitob muvaffaqiyatli o'chirildi.");
  } catch (err) {
    console.error("[deleteBook]", err);
    return error(res, "Kitobni o'chirishda xato.");
  }
}

async function getNewBooks(req, res) {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user?.id || null;
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
      take: Number(limit),
      include: {
        author: { select: { id: true, name: true, slug: true } },
        ...(userId && {
          likes: { where: { userId }, select: { id: true } },
          bookmarks: { where: { userId }, select: { id: true } },
        }),
      },
    });
    const enriched = books.map(({ likes, bookmarks, ...b }) => ({
      ...b,
      isLiked: userId ? (likes?.length ?? 0) > 0 : false,
      isBookmarked: userId ? (bookmarks?.length ?? 0) > 0 : false,
    }));
    return success(res, { books: enriched });
  } catch (err) {
    console.error("[getNewBooks]", err);
    return error(res, "Yangi kitoblarni olishda xato.");
  }
}

async function getPopularBooks(req, res) {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user?.id || null;
    const books = await prisma.book.findMany({
      orderBy: { downloadCount: "desc" },
      take: Number(limit),
      include: {
        author: { select: { id: true, name: true, slug: true } },
        ...(userId && {
          likes: { where: { userId }, select: { id: true } },
          bookmarks: { where: { userId }, select: { id: true } },
        }),
      },
    });
    const enriched = books.map(({ likes, bookmarks, ...b }) => ({
      ...b,
      isLiked: userId ? (likes?.length ?? 0) > 0 : false,
      isBookmarked: userId ? (bookmarks?.length ?? 0) > 0 : false,
    }));
    return success(res, { books: enriched });
  } catch (err) {
    console.error("[getPopularBooks]", err);
    return error(res, "Ommabop kitoblarni olishda xato.");
  }
}

async function downloadBook(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) return error(res, "Kitob topilmadi.", 404);

    // pdfUrl dan bucket ichidagi yo'lni ajratib olish
    // URL ko'rinishi: .../object/public/pdf-books/pdfs/xxx.pdf
    const urlParts = book.pdfUrl.split(`/${process.env.SUPABASE_BUCKET_NAME}/`);
    const filePath = urlParts[1];

    const signedUrl = await createSignedUrl(filePath, 60);

    await Promise.all([
      prisma.book.update({ where: { id }, data: { downloadCount: { increment: 1 } } }),
      prisma.downloadHistory.create({ data: { userId, bookId: id } }),
    ]);

    return success(res, { url: signedUrl }, "Yuklab olish havolasi tayyor.");
  } catch (err) {
    console.error("[downloadBook]", err);
    return error(res, "Yuklab olishda xato.");
  }
}

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook, downloadBook, getNewBooks, getPopularBooks };
