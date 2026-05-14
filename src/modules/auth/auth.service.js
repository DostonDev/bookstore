const bcrypt = require("bcryptjs");
const repo = require("./auth.repository");
const { signToken } = require("../../utils/jwt");

const register = async ({ name, email, password }) => {
  const existing = await repo.findByEmail(email);
  if (existing) throw { status: 409, message: "Bu email allaqachon ro'yxatdan o'tgan." };

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await repo.create({ name, email, password: hashedPassword });
  const token = signToken({ userId: user.id, role: user.role });
  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await repo.findByEmail(email);
  if (!user) throw { status: 401, message: "Email yoki parol noto'g'ri." };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw { status: 401, message: "Email yoki parol noto'g'ri." };

  const token = signToken({ userId: user.id, role: user.role });
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

module.exports = { register, login };
