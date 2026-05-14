const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { signToken } = require("../utils/jwt");
const { success, error } = require("../utils/response");

const prisma = new PrismaClient();

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return error(res, "Bu email allaqachon ro'yxatdan o'tgan.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const token = signToken({ userId: user.id, role: user.role });

    return success(res, { user, token }, "Muvaffaqiyatli ro'yxatdan o'tdingiz.", 201);
  } catch (err) {
    console.error("[register]", err);
    return error(res, "Ro'yxatdan o'tishda xato yuz berdi.");
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return error(res, "Email yoki parol noto'g'ri.", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, "Email yoki parol noto'g'ri.", 401);
    }

    const token = signToken({ userId: user.id, role: user.role });

    const { password: _, ...userWithoutPassword } = user;

    return success(res, { user: userWithoutPassword, token }, "Muvaffaqiyatli kirish.");
  } catch (err) {
    console.error("[login]", err);
    return error(res, "Tizimga kirishda xato yuz berdi.");
  }
}

async function getMe(req, res) {
  try {
    return success(res, { user: req.user }, "Profil ma'lumotlari.");
  } catch (err) {
    console.error("[getMe]", err);
    return error(res, "Ma'lumotlarni olishda xato.");
  }
}

module.exports = { register, login, getMe };
