const prisma = require("../../utils/prisma");

const findProgress = (userId, bookId) =>
  prisma.readingProgress.findUnique({ where: { userId_bookId: { userId, bookId } } });

const upsertProgress = (userId, bookId, data) =>
  prisma.readingProgress.upsert({
    where: { userId_bookId: { userId, bookId } },
    create: { userId, bookId, ...data },
    update: { ...data, lastReadAt: new Date() },
  });

const getUserProgress = (userId) =>
  prisma.readingProgress.findMany({
    where: { userId },
    orderBy: { lastReadAt: "desc" },
    include: {
      book: {
        select: {
          id: true,
          title: true,
          coverUrl: true,
          author: { select: { id: true, name: true } },
        },
      },
    },
  });

module.exports = { findProgress, upsertProgress, getUserProgress };
