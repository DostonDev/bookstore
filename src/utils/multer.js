const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (allowed) => (req, file, cb) => {
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Fayl turi ruxsat etilmagan. Ruxsat etilganlar: ${allowed.join(", ")}`), false);
  }
};

const uploadPdf = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: fileFilter(["application/pdf"]),
});

const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter(["image/jpeg", "image/png", "image/webp"]),
});

const uploadBookFiles = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: fileFilter(["application/pdf", "image/jpeg", "image/png", "image/webp"]),
});

module.exports = { uploadPdf, uploadImage, uploadBookFiles };
