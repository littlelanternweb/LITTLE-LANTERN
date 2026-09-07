const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Create Admin
  // Use a simple hash for 'admin123' just for seeding (salt round 10)
  // In production, NextAuth uses bcrypt directly
  const adminPassword = '$2b$10$G0yK.Qj8A4VfMv5mZ3R0g.a08Q3z4gP1k7P8q9E4N2Z5b8Y9W5w5K'; // admin123
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@littlelantern.com' },
    update: {},
    create: {
      email: 'admin@littlelantern.com',
      password: adminPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Admin created:', admin.email);

  // Create Services
  const servicesData = [
    { name: 'Child Counselling', slug: 'child-counselling', description: 'Professional support for emotional and behavioral challenges.' },
    { name: 'Special Education', slug: 'special-education', description: 'Tailored educational support for children with learning differences.' },
    { name: 'Speech & Language Support', slug: 'speech-language-support', description: 'Therapy to improve communication and speech clarity.' },
    { name: 'Occupational Therapy', slug: 'occupational-therapy', description: 'Developing fine motor skills and sensory processing abilities.' },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }

  console.log('Services created');

  // Create Specialists
  const s1 = await prisma.specialist.create({
    data: {
      name: 'Dr. Sarah Jenkins',
      designation: 'Child Psychologist',
      qualifications: 'Ph.D. in Clinical Psychology',
      experience: 12,
      languages: 'English, Spanish',
      bio: 'Dr. Jenkins specializes in cognitive behavioral therapy for children and adolescents.',
      consultationFee: 150.00,
      services: {
        connect: [{ slug: 'child-counselling' }]
      }
    }
  });

  const s2 = await prisma.specialist.create({
    data: {
      name: 'Michael Chang',
      designation: 'Special Educator',
      qualifications: 'M.Ed. in Special Education',
      experience: 8,
      languages: 'English, Mandarin',
      bio: 'Michael focuses on creating individualized education programs (IEP) to support diverse learning needs.',
      consultationFee: 120.00,
      services: {
        connect: [{ slug: 'special-education' }, { slug: 'speech-language-support' }]
      }
    }
  });

  console.log('Specialists created');

  // Set Availability for Dr. Jenkins (Mon, Tue, Wed 09:00 - 15:00)
  for (let day = 1; day <= 3; day++) {
    await prisma.availability.create({
      data: {
        specialistId: s1.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '15:00',
      }
    });
  }

  // Set Availability for Michael Chang (Thu, Fri 10:00 - 18:00)
  for (let day = 4; day <= 5; day++) {
    await prisma.availability.create({
      data: {
        specialistId: s2.id,
        dayOfWeek: day,
        startTime: '10:00',
        endTime: '18:00',
      }
    });
  }

  console.log('Availability rules created');
  console.log('Seeding complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
