const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

prisma.book.updateMany({ data: { price: 0 } })
  .then(r => { console.log('Updated:', r.count, 'books to free'); })
  .catch(console.error)
  .finally(() => prisma.$disconnect())
