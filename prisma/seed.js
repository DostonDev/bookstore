const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// ─── Data ─────────────────────────────────────────────────────────────────────

const users = [
  { name: "Admin",             email: "admin@bookstore.com",  password: "admin123", role: "ADMIN" },
  { name: "Jasur Yusupov",     email: "jasur@example.com",    password: "user1234", role: "USER"  },
  { name: "Malika Karimova",   email: "malika@example.com",   password: "user1234", role: "USER"  },
  { name: "Bobur Toshmatov",   email: "bobur@example.com",    password: "user1234", role: "USER"  },
];

// Root categories (no parent)
const rootCategories = [
  { name: "Dasturlash",       slug: "dasturlash",       description: "Dasturlash tillari va texnologiyalar" },
  { name: "Dizayn",           slug: "dizayn",           description: "UI/UX va grafik dizayn" },
  { name: "Biznes",           slug: "biznes",           description: "Tadbirkorlik va menejment" },
  { name: "Psixologiya",      slug: "psixologiya",      description: "Shaxsiy o'sish va psixologiya" },
  { name: "Sun'iy Intellekt", slug: "suniy-intellekt",  description: "Machine learning va AI" },
  { name: "Maktab darsliklari", slug: "maktab-darsliklari", description: "Umumta'lim maktablari uchun darsliklar" },
];

// School subjects (children of "Maktab darsliklari")
const schoolSubjects = [
  { name: "Matematika",  slug: "matematika-maktab",  description: "Algebra, geometriya va arifmetika darsliklari" },
  { name: "Fizika",      slug: "fizika-maktab",      description: "Mexanika, optika va elektr darsliklari" },
  { name: "Kimyo",       slug: "kimyo-maktab",       description: "Organik va anorganik kimyo darsliklari" },
  { name: "Biologiya",   slug: "biologiya-maktab",   description: "Botanika, zoologiya va anatomiya darsliklari" },
  { name: "Ona tili",    slug: "ona-tili-maktab",    description: "O'zbek tili grammatika va adabiyot" },
  { name: "Ingliz tili", slug: "ingliz-tili-maktab", description: "Ingliz tili darsliklari" },
  { name: "Tarix",       slug: "tarix-maktab",       description: "O'zbekiston va jahon tarixi darsliklari" },
  { name: "Geografiya",  slug: "geografiya-maktab",  description: "Fizik va iqtisodiy geografiya darsliklari" },
  { name: "Informatika", slug: "informatika-maktab", description: "Kompyuter savodxonligi va dasturlash asoslari" },
];

const authors = [
  { name: "Robert C. Martin",  slug: "robert-c-martin",  bio: "Uncle Bob — dasturlash ustasi, Clean Code muallifi.", website: "https://cleancoder.com", twitter: "unclebobmartin" },
  { name: "Douglas Crockford", slug: "douglas-crockford", bio: "JavaScript ning yaxshi tomonlarini kashf etgan muhandis." },
  { name: "Kyle Simpson",      slug: "kyle-simpson",      bio: "You Don't Know JS seriyasining muallifi.", twitter: "getify" },
  { name: "Martin Fowler",     slug: "martin-fowler",     bio: "Refactoring va Enterprise arxitektura bo'yicha ekspert.", website: "https://martinfowler.com" },
  { name: "Eric Evans",        slug: "eric-evans",        bio: "Domain-Driven Design kitobining muallifi." },
  { name: "Andrew Hunt",       slug: "andrew-hunt",       bio: "The Pragmatic Programmer muallifi." },
];

const tags = [
  { name: "JavaScript",      slug: "javascript"      },
  { name: "Python",          slug: "python"          },
  { name: "React",           slug: "react"           },
  { name: "Node.js",         slug: "nodejs"          },
  { name: "TypeScript",      slug: "typescript"      },
  { name: "CSS",             slug: "css"             },
  { name: "SQL",             slug: "sql"             },
  { name: "Git",             slug: "git"             },
  { name: "Clean Code",      slug: "clean-code"      },
  { name: "Design Patterns", slug: "design-patterns" },
  { name: "Testing",         slug: "testing"         },
  { name: "DevOps",          slug: "devops"          },
];

const booksData = [
  {
    title: "Clean Code",
    description: "Robert C. Martin tomonidan yozilgan bu kitob, sifatli kod yozish san'atini o'rgatadi. Dasturchilarga kodni o'qimishli, qo'llab-quvvatlanadigan va aniq qilish bo'yicha amaliy ko'rsatmalar beradi.",
    price: 49000, downloadCount: 1240, likeCount: 340,
    categorySlug: "dasturlash", authorSlug: "robert-c-martin",
    tags: ["Clean Code", "JavaScript", "Testing"],
  },
  {
    title: "The Pragmatic Programmer",
    description: "David Thomas va Andrew Hunt tomonidan yozilgan dasturchilik klassikasi. Karyerangizni yangilash va professionallikka erishish uchun amaliy maslahatlar.",
    price: 39000, downloadCount: 980, likeCount: 256,
    categorySlug: "dasturlash", authorSlug: "andrew-hunt",
    tags: ["Clean Code", "Design Patterns", "Git"],
  },
  {
    title: "JavaScript: The Good Parts",
    description: "Douglas Crockford JavaScript tilining eng yaxshi qismlari haqida yozadi. Tilning kuchli tomonlarini o'rganib, zaif tomonlaridan qochunga yordam beradi.",
    price: 29000, downloadCount: 2100, likeCount: 512,
    categorySlug: "dasturlash", authorSlug: "douglas-crockford",
    tags: ["JavaScript", "Clean Code"],
  },
  {
    title: "You Don't Know JS",
    description: "Kyle Simpson JavaScript tilini chuqur o'rgatuvchi 6 kitobli seriya. Closure, prototype, async va boshqa muhim mavzularni professional darajada tushuntiradi.",
    price: 0, downloadCount: 3500, likeCount: 890,
    categorySlug: "dasturlash", authorSlug: "kyle-simpson",
    tags: ["JavaScript", "TypeScript", "Node.js"],
  },
  {
    title: "Refactoring",
    description: "Martin Fowler mavjud kodni refaktoring qilish usullarini ko'rsatadi. Kodni o'zgartirmasdan uning tuzilmasini yaxshilash san'ati.",
    price: 55000, downloadCount: 760, likeCount: 198,
    categorySlug: "dasturlash", authorSlug: "martin-fowler",
    tags: ["Clean Code", "Design Patterns", "Testing"],
  },
  {
    title: "Domain-Driven Design",
    description: "Eric Evans DDD metodologiyasini batafsil yoritib beradi. Murakkab biznes domenini dasturiy ta'minotga aylantirish printsiplari.",
    price: 65000, downloadCount: 445, likeCount: 134,
    categorySlug: "dasturlash", authorSlug: "eric-evans",
    tags: ["Design Patterns", "SQL"],
  },
  {
    title: "React in Depth",
    description: "React.js ekotizimini chuqur o'rganish. Hooks, Context, Performance optimization va zamonaviy React patterns.",
    price: 35000, downloadCount: 1850, likeCount: 423,
    categorySlug: "dasturlash", authorSlug: "kyle-simpson",
    tags: ["React", "JavaScript", "TypeScript"],
  },
  {
    title: "Python Essentials",
    description: "Python dasturlash tilini noldan o'rganish. Data science, web development va avtomatlashtirishga kirish.",
    price: 0, downloadCount: 4200, likeCount: 1100,
    categorySlug: "dasturlash", authorSlug: "robert-c-martin",
    tags: ["Python", "SQL", "Testing"],
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Foydalanuvchi interfeysi va tajribasini loyihalash asoslari. Zamonaviy dizayn tamoyillari va amaliyotlar.",
    price: 42000, downloadCount: 890, likeCount: 267,
    categorySlug: "dizayn", authorSlug: "martin-fowler",
    tags: ["CSS", "Design Patterns"],
  },
  {
    title: "Startup Secrets",
    description: "Muvaffaqiyatli startap qurish sirlariga oid amaliy qo'llanma. Biznes-model, moliyalashtirish va jamoani boshqarish.",
    price: 59000, downloadCount: 670, likeCount: 189,
    categorySlug: "biznes", authorSlug: "andrew-hunt",
    tags: ["Design Patterns"],
  },
  {
    title: "Machine Learning Basics",
    description: "ML asoslarini qo'llanma. Supervised, unsupervised learning va neural networks bilan ishlash.",
    price: 75000, downloadCount: 1120, likeCount: 334,
    categorySlug: "suniy-intellekt", authorSlug: "douglas-crockford",
    tags: ["Python", "SQL", "Testing"],
  },
  {
    title: "Node.js Mastery",
    description: "Server-side JavaScript bilan professional ilovalar qurish. Express, REST API, JWT va real-time ilovalar.",
    price: 45000, downloadCount: 930, likeCount: 241,
    categorySlug: "dasturlash", authorSlug: "kyle-simpson",
    tags: ["Node.js", "JavaScript", "SQL", "Git"],
  },
  // Maktab darsliklari
  {
    title: "Algebra va Analiz — 10-sinf",
    description: "O'zbekiston umumta'lim maktablarining 10-sinfi uchun matematika darsligi. Trigonometriya, logarifmlar va funksiyalar.",
    price: 0, downloadCount: 520, likeCount: 145,
    categorySlug: "matematika-maktab", authorSlug: "robert-c-martin",
    tags: [],
  },
  {
    title: "Geometriya — 9-sinf",
    description: "To'g'ri chiziq, tekislik va fazoda geometrik shakllar. Isbotlash usullari va masalalar yechish.",
    price: 0, downloadCount: 380, likeCount: 98,
    categorySlug: "matematika-maktab", authorSlug: "eric-evans",
    tags: [],
  },
  {
    title: "Fizika — 11-sinf",
    description: "Optika, kvant fizikasi va atom yadrosi. Maktab fizikasining yuqori sinf kursi.",
    price: 0, downloadCount: 460, likeCount: 112,
    categorySlug: "fizika-maktab", authorSlug: "martin-fowler",
    tags: [],
  },
  {
    title: "Kimyo — 8-sinf",
    description: "Kimyoviy reaksiyalar, elementlar davriy jadvali va oddiy birikmalar. Maktab kimyosiga kirish.",
    price: 0, downloadCount: 290, likeCount: 76,
    categorySlug: "kimyo-maktab", authorSlug: "douglas-crockford",
    tags: [],
  },
  {
    title: "Biologiya — 7-sinf",
    description: "O'simliklar va hayvonlar dunyosi. Botanika va zoologiya asoslari.",
    price: 0, downloadCount: 310, likeCount: 88,
    categorySlug: "biologiya-maktab", authorSlug: "andrew-hunt",
    tags: [],
  },
  {
    title: "Ingliz tili — 9-sinf",
    description: "O'rta maktab uchun ingliz tili darsligi. Grammar, reading va speaking mashqlari.",
    price: 0, downloadCount: 680, likeCount: 201,
    categorySlug: "ingliz-tili-maktab", authorSlug: "kyle-simpson",
    tags: [],
  },
  {
    title: "O'zbekiston tarixi — 11-sinf",
    description: "Mustaqillik yillari va zamonaviy O'zbekiston tarixi. Yuqori sinf uchun.",
    price: 0, downloadCount: 420, likeCount: 134,
    categorySlug: "tarix-maktab", authorSlug: "eric-evans",
    tags: [],
  },
  {
    title: "Informatika — 10-sinf",
    description: "Algoritmlash asoslari, ma'lumotlar bazasi va dasturlashga kirish.",
    price: 0, downloadCount: 550, likeCount: 167,
    categorySlug: "informatika-maktab", authorSlug: "robert-c-martin",
    tags: ["Python"],
  },
];

const blogsData = [
  {
    title: "Clean Code yozishning 10 ta asosiy qoidasi",
    slug: "clean-code-10-qoida",
    content: "Sifatli kod yozish — bu san'at. Har bir dasturchi o'z kodini boshqalar oson o'qiy oladigan qilib yozishi kerak.\n\n1. Mazmunli nomlar ishlating\n\n2. Funksiyalar kichik bo'lsin\n\n3. Izoh yozishdan ko'ra, kod o'zini tushuntirsin",
    excerpt: "Sifatli kod yozish san'ati — bu bizning kasbimizdagi eng muhim mahorat.",
    readingTime: 5, status: "PUBLISHED",
    categorySlug: "dasturlash", authorSlug: "robert-c-martin",
    tags: ["Clean Code", "JavaScript"],
  },
  {
    title: "JavaScript 2025: Yangi funksiyalar",
    slug: "javascript-2025-yangi-funksiyalar",
    content: "JavaScript har yili yangi imkoniyatlar bilan boyib bormoqda.\n\nPattern Matching\nYangi switch ifodasi kabi imkoniyat.\n\nTemporal API\nSana bilan ishlash yanada osonlashdi.",
    excerpt: "JavaScript 2025 versiyasida qanday yangi funksiyalar qo'shiladi?",
    readingTime: 4, status: "PUBLISHED",
    categorySlug: "dasturlash", authorSlug: "kyle-simpson",
    tags: ["JavaScript", "TypeScript"],
  },
  {
    title: "React vs Vue: Qaysi birini tanlash kerak?",
    slug: "react-vs-vue-tanlash",
    content: "Frontend framework tanlash — bu muhim qaror.\n\nReact\nFacebook tomonidan yaratilgan, katta ekotizim.\n\nVue\nOson o'rganish, progressiv framework.",
    excerpt: "React va Vue ni taqqoslab, loyihangiz uchun to'g'ri tanlov qiling.",
    readingTime: 6, status: "PUBLISHED",
    categorySlug: "dasturlash", authorSlug: "martin-fowler",
    tags: ["React", "JavaScript"],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding boshlandi...\n");

  // Users
  const createdUsers = [];
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, password: hashed },
    });
    createdUsers.push(user);
    console.log(`👤 User: ${user.email} (${user.role})`);
  }

  // Root categories
  const categoryMap = {};
  for (const c of rootCategories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, parentId: null },
      create: { ...c, parentId: null },
    });
    categoryMap[c.slug] = cat;
    console.log(`📁 Category: ${cat.name}`);
  }

  // School subjects (children)
  const parentCat = categoryMap["maktab-darsliklari"];
  for (const s of schoolSubjects) {
    const existing = await prisma.category.findFirst({
      where: { OR: [{ slug: s.slug }, { name: s.name }] },
    });
    let cat;
    if (existing) {
      cat = await prisma.category.update({
        where: { id: existing.id },
        data: { description: s.description, parentId: parentCat.id },
      });
    } else {
      cat = await prisma.category.create({
        data: { ...s, parentId: parentCat.id },
      });
    }
    categoryMap[s.slug] = cat;
    categoryMap[cat.slug] = cat;
    console.log(`  📚 Subject: ${cat.name}`);
  }

  // Authors
  const authorMap = {};
  for (const a of authors) {
    const author = await prisma.author.upsert({
      where: { slug: a.slug },
      update: { name: a.name, bio: a.bio },
      create: a,
    });
    authorMap[a.slug] = author;
    console.log(`✍️  Author: ${author.name}`);
  }

  // Tags
  const tagMap = {};
  for (const t of tags) {
    const tag = await prisma.tag.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
    tagMap[t.name] = tag;
    console.log(`🏷️  Tag: ${tag.name}`);
  }

  // Books
  const createdBooks = [];
  for (const b of booksData) {
    const { tags: bookTags, categorySlug, authorSlug, ...bookData } = b;

    // Check if book with same title exists
    const existing = await prisma.book.findFirst({ where: { title: bookData.title } });
    let book;
    if (existing) {
      book = existing;
      console.log(`📚 Book exists: ${book.title}`);
    } else {
      book = await prisma.book.create({
        data: {
          ...bookData,
          pdfUrl: `https://example.com/pdfs/${bookData.title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
          categoryId: categoryMap[categorySlug]?.id || null,
          authorId: authorMap[authorSlug]?.id || null,
        },
      });
      console.log(`📚 Book: ${book.title} (${book.price === 0 ? "BEPUL" : book.price + " so'm"})`);
    }

    for (const tagName of (bookTags || [])) {
      const tag = tagMap[tagName];
      if (tag) {
        await prisma.bookTag.upsert({
          where: { bookId_tagId: { bookId: book.id, tagId: tag.id } },
          update: {},
          create: { bookId: book.id, tagId: tag.id },
        });
      }
    }
    createdBooks.push(book);
  }

  // Blogs
  for (const b of blogsData) {
    const { tags: blogTags, categorySlug, authorSlug, ...blogData } = b;
    const existing = await prisma.blog.findUnique({ where: { slug: blogData.slug } });
    if (existing) { console.log(`📝 Blog exists: ${blogData.title}`); continue; }

    const blog = await prisma.blog.create({
      data: {
        ...blogData,
        categoryId: categoryMap[categorySlug]?.id || null,
        authorId: authorMap[authorSlug]?.id || null,
      },
    });
    for (const tagName of (blogTags || [])) {
      const tag = tagMap[tagName];
      if (tag) {
        await prisma.blogTag.upsert({
          where: { blogId_tagId: { blogId: blog.id, tagId: tag.id } },
          update: {},
          create: { blogId: blog.id, tagId: tag.id },
        });
      }
    }
    console.log(`📝 Blog: ${blog.title}`);
  }

  // Comments
  const regularUsers = createdUsers.filter(u => u.role === "USER");
  const comments = [
    "Juda zo'r kitob, tavsiya qilaman!",
    "Majburiy o'qish!",
    "Tushuntirishlar juda aniq va tushunarli.",
    "Amaliyotga oid ko'p misollar bor.",
    "Bu kitobni o'qib ko'p narsalarni o'rgandim.",
    "Professional darajada yozilgan.",
  ];
  for (let i = 0; i < regularUsers.length; i++) {
    for (let j = 0; j < 4; j++) {
      const book = createdBooks[(i + j) % createdBooks.length];
      await prisma.comment.create({
        data: { text: comments[(i + j) % comments.length], userId: regularUsers[i].id, bookId: book.id },
      });
    }
  }
  console.log("💬 Comments created");

  // Ratings
  for (let i = 0; i < regularUsers.length; i++) {
    for (let j = 0; j < Math.min(8, createdBooks.length); j++) {
      const book = createdBooks[j];
      await prisma.rating.upsert({
        where: { userId_bookId: { userId: regularUsers[i].id, bookId: book.id } },
        update: {},
        create: { value: [4, 4, 5, 5, 5, 3, 4, 5][j % 8], userId: regularUsers[i].id, bookId: book.id },
      });
    }
  }
  console.log("⭐ Ratings created");

  // Likes & Downloads
  for (let i = 0; i < regularUsers.length; i++) {
    for (let j = 0; j < 5; j++) {
      const book = createdBooks[(i * 2 + j) % createdBooks.length];
      await prisma.like.upsert({
        where: { userId_bookId: { userId: regularUsers[i].id, bookId: book.id } },
        update: {},
        create: { userId: regularUsers[i].id, bookId: book.id },
      });
      await prisma.downloadHistory.create({
        data: { userId: regularUsers[i].id, bookId: book.id },
      });
    }
  }

  // Update likeCount & downloadCount
  for (const book of createdBooks) {
    const [likes, downloads] = await Promise.all([
      prisma.like.count({ where: { bookId: book.id } }),
      prisma.downloadHistory.count({ where: { bookId: book.id } }),
    ]);
    await prisma.book.update({
      where: { id: book.id },
      data: { likeCount: likes, downloadCount: downloads },
    });
  }
  console.log("❤️  Likes and downloads updated");

  // Bookmarks
  for (let i = 0; i < regularUsers.length; i++) {
    for (let j = 0; j < 3; j++) {
      const book = createdBooks[(i + j + 1) % createdBooks.length];
      await prisma.bookmark.upsert({
        where: { userId_bookId: { userId: regularUsers[i].id, bookId: book.id } },
        update: {},
        create: { userId: regularUsers[i].id, bookId: book.id },
      });
    }
  }
  console.log("🔖 Bookmarks created");

  console.log("\n✅ Seeding muvaffaqiyatli yakunlandi!");
  console.log("Admin: admin@bookstore.com / admin123");
  console.log("User:  jasur@example.com / user1234");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
