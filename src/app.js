require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./modules/auth/auth.routes");
const booksRoutes = require("./modules/books/books.routes");
const categoriesRoutes = require("./modules/categories/categories.routes");
const authorsRoutes = require("./modules/authors/authors.routes");
const tagsRoutes = require("./modules/tags/tags.routes");
const searchRoutes = require("./modules/search/search.routes");
const blogsRoutes = require("./modules/blogs/blogs.routes");
const analyticsRoutes = require("./modules/analytics/analytics.routes");
const pdfReaderRoutes = require("./modules/pdf-reader/pdf-reader.routes");
const socialRoutes = require("./modules/social/social.routes");
const usersRoutes = require("./modules/users/users.routes");

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
  : ["*"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/authors", authorsRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reader", pdfReaderRoutes);
app.use("/api", socialRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint topilmadi." });
});

app.use((err, req, res, next) => {
  console.error("[GlobalError]", err);

  if (err.message?.includes("Fayl turi ruxsat etilmagan") || err.message?.includes("Faqat PDF")) {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ success: false, message: "Fayl hajmi juda katta." });
  }

  res.status(500).json({ success: false, message: "Server ichki xatosi." });
});

module.exports = app;
