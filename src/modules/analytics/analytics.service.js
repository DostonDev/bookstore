const prisma = require("../../utils/prisma");

const getAdminStats = async () => {
  const [
    totalUsers,
    totalBooks,
    totalDownloads,
    topBooks,
    topCategories,
    topAuthors,
    recentUsers,
    userGrowth,
    downloadGrowth,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.downloadHistory.count(),

    prisma.book.findMany({
      take: 10,
      orderBy: { downloadCount: "desc" },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    }),

    prisma.category.findMany({
      take: 5,
      include: { _count: { select: { books: true } } },
      orderBy: { books: { _count: "desc" } },
    }),

    prisma.author.findMany({
      take: 5,
      include: { _count: { select: { books: true } } },
      orderBy: { books: { _count: "desc" } },
    }),

    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),

    prisma.$queryRaw`
      SELECT DATE_TRUNC('month', "createdAt") as month,
             COUNT(*)::int as count
      FROM users
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC
    `,

    prisma.$queryRaw`
      SELECT DATE_TRUNC('month', "createdAt") as month,
             COUNT(*)::int as count
      FROM download_history
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC
    `,
  ]);

  return {
    stats: { totalUsers, totalBooks, totalDownloads },
    topBooks,
    topCategories,
    topAuthors,
    recentUsers,
    charts: {
      userGrowth: formatChartData(userGrowth),
      downloadGrowth: formatChartData(downloadGrowth),
    },
  };
};

const formatChartData = (rows) =>
  rows.map((r) => ({
    name: new Date(r.month).toLocaleDateString("uz-UZ", { month: "short", year: "numeric" }),
    value: r.count,
  }));

const getUserDashboard = async (userId) => {
  const [
    bookmarks,
    downloads,
    readingProgress,
    recentActivity,
  ] = await Promise.all([
    prisma.bookmark.count({ where: { userId } }),
    prisma.downloadHistory.count({ where: { userId } }),
    prisma.readingProgress.findMany({
      where: { userId },
      orderBy: { lastReadAt: "desc" },
      take: 5,
      include: { book: { select: { id: true, title: true, coverUrl: true } } },
    }),
    prisma.downloadHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { book: { select: { id: true, title: true, coverUrl: true } } },
    }),
  ]);

  return { bookmarks, downloads, readingProgress, recentActivity };
};

module.exports = { getAdminStats, getUserDashboard };
