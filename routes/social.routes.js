const { Router } = require("express");
const { body } = require("express-validator");
const { validate } = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const {
  getComments,
  addComment,
  deleteComment,
  rateBook,
  getBookRating,
  toggleLike,
  toggleBookmark,
  getBookmarks,
  getLikes,
} = require("../controllers/social.controller");

const router = Router();

// ─── Comments ─────────────────────────────────────────────────────────────────
router.get("/books/:bookId/comments", getComments);

router.post(
  "/books/:bookId/comments",
  authenticate,
  [body("text").trim().notEmpty().withMessage("Izoh matni bo'sh bo'lmasin.")],
  validate,
  addComment
);

router.delete("/comments/:id", authenticate, deleteComment);

// ─── Rating ───────────────────────────────────────────────────────────────────
router.get("/books/:bookId/rating", authenticate, getBookRating);

router.post(
  "/books/:bookId/rating",
  authenticate,
  [body("value").isInt({ min: 1, max: 5 }).withMessage("Baho 1-5 oralig'ida bo'lsin.")],
  validate,
  rateBook
);

// ─── Likes ────────────────────────────────────────────────────────────────────
router.post("/books/:bookId/like", authenticate, toggleLike);

// ─── Bookmarks ────────────────────────────────────────────────────────────────
router.post("/books/:bookId/bookmark", authenticate, toggleBookmark);
router.get("/bookmarks", authenticate, getBookmarks);
router.get("/likes", authenticate, getLikes);

module.exports = router;
