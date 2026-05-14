const { verifyToken } = require("../utils/jwt");
const { error } = require("../utils/response");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return error(res, "Token topilmadi. Iltimos, tizimga kiring.", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return error(res, "Foydalanuvchi topilmadi.", 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return error(res, "Token muddati tugagan. Qayta kiring.", 401);
    }
    if (err.name === "JsonWebTokenError") {
      return error(res, "Noto'g'ri token.", 401);
    }
    return error(res, "Autentifikatsiya xatosi.", 401);
  }
}

async function optionalAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });
    req.user = user || null;
    next();
  } catch {
    req.user = null;
    next();
  }
}

module.exports = { authenticate, optionalAuthenticate };
