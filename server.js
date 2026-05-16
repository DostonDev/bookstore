require("dotenv").config();

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server ishga tushdi: http://localhost:${PORT}`);
    console.log(`📦 Muhit: ${process.env.NODE_ENV || "development"}`);
    console.log(`\n📌 Asosiy endpointlar:`);
    console.log(`  /api/auth        – Autentifikatsiya`);
    console.log(`  /api/books       – Kitoblar`);
    console.log(`  /api/categories  – Kategoriyalar`);
    console.log(`  /api/authors     – Mualliflar`);
    console.log(`  /api/tags        – Teglar`);
    console.log(`  /api/search      – Qidiruv`);
    console.log(`  /api/blogs       – Blog`);
    console.log(`  /api/analytics   – Analitika`);
    console.log(`  /api/reader      – PDF O'quvchi`);
    console.log(`  /api/users       – Foydalanuvchilar\n`);
  });
}

module.exports = app;
