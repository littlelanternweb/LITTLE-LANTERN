const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const specs = await prisma.specialist.findMany();
  console.log(specs);
}
main().finally(() => prisma.$disconnect());
