const { PrismaClient } = require("@prisma/client");
const { success, error } = require("../utils/response");

const prisma = new PrismaClient();

async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            bookmarks: true,
            downloads: true,
            comments: true,
            likes: true,
          },
        },
      },
    });
    return success(res, { user });
  } catch (err) {
    console.error("[getProfile]", err);
    return error(res, "Profilni olishda xato.");
  }
}

async function getDownloadHistory(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [downloads, total] = await Promise.all([
      prisma.downloadHistory.findMany({
        where: { userId: req.user.id },
        include: {
          book: {
            select: { id: true, title: true, coverUrl: true, price: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.downloadHistory.count({ where: { userId: req.user.id } }),
    ]);

    return success(res, {
      downloads,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error("[getDownloadHistory]", err);
    return error(res, "Yuklab olishlar tarixini olishda xato.");
  }
}

async function getAllUsers(req, res) {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: { orders: true, downloads: true, bookmarks: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.user.count({ where }),
    ]);

    return success(res, {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error("[getAllUsers]", err);
    return error(res, "Foydalanuvchilarni olishda xato.");
  }
}

module.exports = { getProfile, getDownloadHistory, getAllUsers };
