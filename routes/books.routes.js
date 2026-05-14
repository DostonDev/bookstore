const { Router } = require("express");
const { body } = require("express-validator");
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  downloadBook,
  getNewBooks,
  getPopularBooks,
} = require("../controllers/books.controller");
const { authenticate, optionalAuthenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { uploadBookFiles } = require("../utils/multer");

const router = Router();

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Barcha kitoblar ro'yxati
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sahifa raqami
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Har sahifadagi kitoblar soni
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Nom yoki tavsif bo'yicha qidirish
 *     responses:
 *       200:
 *         description: Kitoblar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BooksListResponse'
 */
router.get("/", optionalAuthenticate, getAllBooks);
router.get("/new", optionalAuthenticate, getNewBooks);
router.get("/popular", optionalAuthenticate, getPopularBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Bitta kitob ma'lumotlari
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kitob ID si
 *     responses:
 *       200:
 *         description: Kitob topildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     book:
 *                       $ref: '#/components/schemas/Book'
 *       404:
 *         description: Kitob topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", optionalAuthenticate, getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Yangi kitob qo'shish (faqat ADMIN)
 *     tags: [Books]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *               - pdf
 *             properties:
 *               title:
 *                 type: string
 *                 example: Clean Code
 *               description:
 *                 type: string
 *                 example: Robert Martin tomonidan yozilgan kitob
 *               price:
 *                 type: number
 *                 example: 29.99
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: PDF fayl (max 50MB)
 *               cover:
 *                 type: string
 *                 format: binary
 *                 description: Muqova rasmi — JPEG/PNG/WEBP (max 5MB, ixtiyoriy)
 *     responses:
 *       201:
 *         description: Kitob muvaffaqiyatli qo'shildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     book:
 *                       $ref: '#/components/schemas/Book'
 *       400:
 *         description: PDF fayl yuklanmagan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Autentifikatsiya talab etiladi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Faqat ADMIN uchun
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  uploadBookFiles.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  [
    body("title").trim().notEmpty().withMessage("Kitob nomi kiritilishi shart."),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Narx musbat son bo'lishi kerak."),
  ],
  validate,
  createBook
);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Kitobni yangilash (faqat ADMIN)
 *     tags: [Books]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kitob ID si
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: Yangi PDF fayl (ixtiyoriy)
 *               cover:
 *                 type: string
 *                 format: binary
 *                 description: Yangi muqova rasmi (ixtiyoriy)
 *     responses:
 *       200:
 *         description: Kitob yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     book:
 *                       $ref: '#/components/schemas/Book'
 *       403:
 *         description: Faqat ADMIN uchun
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Kitob topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  uploadBookFiles.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  updateBook
);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Kitobni o'chirish (faqat ADMIN)
 *     tags: [Books]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kitob ID si
 *     responses:
 *       200:
 *         description: Kitob o'chirildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       403:
 *         description: Faqat ADMIN uchun
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Kitob topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", authenticate, authorize("ADMIN"), deleteBook);

/**
 * @swagger
 * /api/books/{id}/download:
 *   get:
 *     summary: Kitobni yuklab olish (faqat PAID order bo'lsa)
 *     tags: [Books]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kitob ID si
 *     responses:
 *       200:
 *         description: Yuklab olish havolasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       description: 60 soniyaga yaroqli signed URL
 *       403:
 *         description: Kitob xarid qilinmagan
 *       404:
 *         description: Kitob topilmadi
 */
router.get("/:id/download", authenticate, downloadBook);

module.exports = router;
