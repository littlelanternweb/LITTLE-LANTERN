const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@littlelantern.com';
  const plainPassword = 'admin'; // We will just use 'admin' or 'admin123'
  
  // Hash the password
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Super Admin'
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN'
    }
  });

  console.log('Admin user created/updated successfully:', user.email);
}

main().finally(() => prisma.$disconnect());
