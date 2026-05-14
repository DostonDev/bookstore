const { verifyToken } = require("../utils/jwt");
const prisma = require("../utils/prisma");
const { error } = require("../utils/response");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return error(res, "Token topilmadi.", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) return error(res, "Foydalanuvchi topilmadi.", 401);

    req.user = user;
    next();
  } catch {
    return error(res, "Token yaroqsiz.", 401);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return next();

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (user) req.user = user;
  } catch {}
  next();
};

module.exports = { authenticate, optionalAuth };
