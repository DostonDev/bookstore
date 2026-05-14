const router = require("express").Router();
const ctrl = require("./social.controller");
const { authenticate, optionalAuth } = require("../../middlewares/auth.middleware");

router.get("/books/:bookId/comments", ctrl.getComments);
router.post("/books/:bookId/comments", authenticate, ctrl.addComment);
router.delete("/comments/:id", authenticate, ctrl.deleteComment);

router.post("/books/:bookId/rating", authenticate, ctrl.rateBook);
router.get("/books/:bookId/rating", optionalAuth, ctrl.getBookRating);

router.post("/books/:bookId/like", authenticate, ctrl.toggleLike);
router.post("/books/:bookId/bookmark", authenticate, ctrl.toggleBookmark);
router.get("/bookmarks", authenticate, ctrl.getBookmarks);
router.get("/likes", authenticate, ctrl.getLikes);

module.exports = router;
