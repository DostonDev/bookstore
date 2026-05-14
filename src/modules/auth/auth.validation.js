const { body } = require("express-validator");

const registerRules = [
  body("name").trim().notEmpty().withMessage("Ism kiritilmagan."),
  body("email").isEmail().withMessage("Email noto'g'ri."),
  body("password").isLength({ min: 6 }).withMessage("Parol kamida 6 ta belgidan iborat bo'lishi kerak."),
];

const loginRules = [
  body("email").isEmail().withMessage("Email noto'g'ri."),
  body("password").notEmpty().withMessage("Parol kiritilmagan."),
];

module.exports = { registerRules, loginRules };
