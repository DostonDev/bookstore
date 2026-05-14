const prisma = require("../../utils/prisma");

const findByEmail = (email) =>
  prisma.user.findUnique({ where: { email } });

const findById = (id) =>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

const create = (data) =>
  prisma.user.create({
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

module.exports = { findByEmail, findById, create };
