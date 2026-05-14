const multer = require("multer");

const storage = multer.memoryStorage();

function fileFilter(allowedMimes) {
  return (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Fayl turi ruxsat etilmagan. Ruxsat etilganlar: ${allowedMimes.join(", ")}`
        ),
        false
      );
    }
  };
}

const uploadPdf = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: fileFilter(["application/pdf"]),
});

const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: fileFilter(["image/jpeg", "image/png", "image/webp"]),
});

const uploadBookFiles = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Faqat PDF va rasm fayllari ruxsat etilgan"), false);
    }
  },
});

module.exports = { uploadPdf, uploadImage, uploadBookFiles };
