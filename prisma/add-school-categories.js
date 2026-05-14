const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Get or create parent
  const parent = await prisma.category.upsert({
    where: { slug: "maktab-darsliklari" },
    update: { name: "Maktab darsliklari", description: "Umumta'lim maktablari uchun darsliklar" },
    create: { name: "Maktab darsliklari", slug: "maktab-darsliklari", description: "Umumta'lim maktablari uchun darsliklar" },
  });
  console.log("✅ Parent:", parent.name, "(id:", parent.id + ")");

  const subjects = [
    { name: "Matematika",  slug: "matematika-maktab",  description: "Algebra, geometriya va arifmetika darsliklari" },
    { name: "Fizika",      slug: "fizika-maktab",       description: "Mexanika, optika va elektr darsliklari" },
    { name: "Kimyo",       slug: "kimyo-maktab",        description: "Organik va anorganik kimyo darsliklari" },
    { name: "Biologiya",   slug: "biologiya-maktab",    description: "Botanika, zoologiya va anatomiya darsliklari" },
    { name: "Ona tili",    slug: "ona-tili-maktab",     description: "O'zbek tili grammatika va adabiyot" },
    { name: "Ingliz tili", slug: "ingliz-tili-maktab",  description: "Ingliz tili darsliklari" },
    { name: "Tarix",       slug: "tarix-maktab",        description: "O'zbekiston va jahon tarixi darsliklari" },
    { name: "Geografiya",  slug: "geografiya-maktab",   description: "Fizik va iqtisodiy geografiya darsliklari" },
    { name: "Informatika", slug: "informatika-maktab",  description: "Kompyuter savodxonligi va dasturlash asoslari" },
  ];

  // Fetch all matching by slug or name in one query
  const existing = await prisma.category.findMany({
    where: {
      OR: [
        ...subjects.map(s => ({ slug: s.slug })),
        ...subjects.map(s => ({ name: s.name })),
      ],
    },
  });

  const existingByName = {};
  const existingBySlug = {};
  for (const e of existing) {
    existingByName[e.name] = e;
    existingBySlug[e.slug] = e;
  }

  for (const s of subjects) {
    const found = existingBySlug[s.slug] || existingByName[s.name];
    if (found) {
      await prisma.category.update({
        where: { id: found.id },
        data: { parentId: parent.id, description: s.description },
      });
      console.log("  ✏️  Updated:", s.name);
    } else {
      await prisma.category.create({
        data: { ...s, parentId: parent.id },
      });
      console.log("  ➕ Created:", s.name);
    }
  }

  console.log("\n✅ Barcha maktab fanlari qo'shildi!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
