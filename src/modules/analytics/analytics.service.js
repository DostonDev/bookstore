const prisma = require("../../utils/prisma");

const getAdminStats = async () => {
  const [
    totalUsers,
    totalBooks,
    totalOrders,
    totalDownloads,
    topBooks,
    topCategories,
    topAuthors,
    recentUsers,
    recentOrders,
    userGrowth,
    downloadGrowth,
    orderGrowth,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.downloadHistory.count(),

    prisma.book.findMany({
      take: 10,
      orderBy: { downloadCount: "desc" },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
        _count: { select: { orders: true } },
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

    prisma.order.findMany({
      take: 5,
      where: { status: "PAID" },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        book: { select: { id: true, title: true, price: true } },
      },
    }),

    // Monthly user growth (last 6 months)
    prisma.$queryRaw`
      SELECT DATE_TRUNC('month', "createdAt") as month,
             COUNT(*)::int as count
      FROM users
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC
    `,

    // Monthly download growth
    prisma.$queryRaw`
      SELECT DATE_TRUNC('month', "createdAt") as month,
             COUNT(*)::int as count
      FROM download_history
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC
    `,

    // Monthly order growth
    prisma.$queryRaw`
      SELECT DATE_TRUNC('month', "createdAt") as month,
             COUNT(*)::int as count
      FROM orders
      WHERE status = 'PAID'
        AND "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC
    `,
  ]);

  const revenueResult = await prisma.$queryRaw`
    SELECT COALESCE(SUM(b.price), 0)::float AS revenue
    FROM orders o
    JOIN books b ON o."bookId" = b.id
    WHERE o.status = 'PAID'
  `;
  const revenue = revenueResult[0]?.revenue || 0;

  return {
    stats: { totalUsers, totalBooks, totalOrders, totalDownloads, revenue },
    topBooks,
    topCategories,
    topAuthors,
    recentUsers,
    recentOrders,
    charts: {
      userGrowth: formatChartData(userGrowth),
      downloadGrowth: formatChartData(downloadGrowth),
      orderGrowth: formatChartData(orderGrowth),
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
