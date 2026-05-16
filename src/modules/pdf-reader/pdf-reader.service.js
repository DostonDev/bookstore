const repo = require("./pdf-reader.repository");
const prisma = require("../../utils/prisma");
const { createSignedUrl } = require("../../utils/supabase");

const getReadUrl = async (bookId, userId) => {
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) throw { status: 404, message: "Kitob topilmadi." };
  if (!book.pdfUrl) throw { status: 404, message: "Bu kitobning PDF fayli hali yuklanmagan." };

  const urlParts = book.pdfUrl.split(`/${process.env.SUPABASE_BUCKET_NAME}/`);
  const filePath = urlParts[1];
  if (!filePath) throw { status: 404, message: "PDF fayl manzili noto'g'ri." };

  const url = await createSignedUrl(filePath, 3600);
  const progress = await repo.findProgress(userId, bookId);

  return { url, progress };
};

const updateProgress = async (userId, bookId, { currentPage, totalPages, readingTime }) => {
  const percentage = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;
  const completed = percentage >= 95;

  return repo.upsertProgress(userId, bookId, {
    currentPage,
    totalPages,
    percentage,
    completed,
    readingTime: readingTime || 0,
  });
};

const getUserProgress = (userId) => repo.getUserProgress(userId);

const getProgress = async (userId, bookId) => {
  const progress = await repo.findProgress(userId, bookId);
  return progress || null;
};

module.exports = { getReadUrl, updateProgress, getUserProgress, getProgress };
