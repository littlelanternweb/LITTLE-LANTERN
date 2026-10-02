const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.user.update({
    where: { email: 'littlelanternweb@gmail.com' },
    data: { role: 'ADMIN' }
  });
  console.log('Updated to ADMIN');
}
main().finally(() => prisma.$disconnect());
