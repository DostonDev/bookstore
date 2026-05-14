const prisma = require("../../utils/prisma");
const { success, error } = require("../../utils/response");
const { getPagination, buildMeta } = require("../../utils/pagination");
const { uploadFile, deleteFile } = require("../../utils/supabase");

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  createdAt: true,
  _count: {
    select: { bookmarks: true, downloads: true, comments: true, likes: true },
  },
};

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: userSelect });
    return success(res, { user });
  } catch (err) {
    return error(res, "Profilni olishda xato.");
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return error(res, "Rasm yuklanmadi.", 400);

    const existing = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { avatarUrl: true },
    });

    if (existing?.avatarUrl) {
      const path = existing.avatarUrl.split(`/${process.env.SUPABASE_BUCKET_NAME}/`)[1];
      if (path) await deleteFile(path).catch(() => {});
    }

    const { url } = await uploadFile(req.file.buffer, req.file.originalname, "avatars");
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl: url },
      select: userSelect,
    });

    return success(res, { user }, "Avatar yangilandi.");
  } catch (err) {
    return error(res, "Avatar yuklashda xato.");
  }
};

const getDownloadHistory = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const [downloads, total] = await Promise.all([
      prisma.downloadHistory.findMany({
        where: { userId: req.user.id },
        include: { book: { select: { id: true, title: true, coverUrl: true, price: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.downloadHistory.count({ where: { userId: req.user.id } }),
    ]);
    return success(res, { downloads, pagination: buildMeta(total, page, limit) });
  } catch (err) {
    return error(res, "Yuklab olishlar tarixini olishda xato.");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const where = req.query.search
      ? { OR: [
          { name: { contains: req.query.search, mode: "insensitive" } },
          { email: { contains: req.query.search, mode: "insensitive" } },
        ]}
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, name: true, email: true, role: true, avatarUrl: true, createdAt: true,
          _count: { select: { downloads: true, bookmarks: true, likes: true, comments: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return success(res, { users, pagination: buildMeta(total, page, limit) });
  } catch (err) {
    return error(res, "Foydalanuvchilarni olishda xato.");
  }
};

module.exports = { getProfile, uploadAvatar, getDownloadHistory, getAllUsers };
