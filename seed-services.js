const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const services = [
  { name: "Child Counselling", slug: "child-counselling", description: "Emotional support for children and adolescents." },
  { name: "Individual Counselling", slug: "individual-counselling", description: "One-to-one professional counselling tailored to the individual needs of the child or adolescent." },
  { name: "Group Counselling", slug: "group-counselling", description: "Supportive sessions in a small group setting to develop communication and confidence." },
  { name: "Special Education", slug: "special-education", description: "Personalised learning support for individual neurodivergent needs." },
  { name: "Speech & Language Support", slug: "speech-language-support", description: "Expert support for communication, articulation, and language comprehension." },
  { name: "Occupational Therapy", slug: "occupational-therapy", description: "Developing fine motor skills, sensory processing, and independent daily living." },
  { name: "Behavioural Support", slug: "behavioural-support", description: "Practical strategies for positive behavioural development and emotional regulation." },
  { name: "Learning Support", slug: "learning-support", description: "Focused support for learning challenges and overall academic growth." },
  { name: "Psychological Consultation", slug: "psychological-consultation", description: "Professional assessment, clinical insight and comprehensive guidance." },
  { name: "Psychometric Testing", slug: "psychometric-testing", description: "Assessment to understand cognitive, behavioural, emotional and learning areas." },
  { name: "Career Counselling", slug: "career-counselling", description: "Guidance to help students understand interests, strengths and suitable pathways." },
  { name: "Remedial Teaching", slug: "remedial-teaching", description: "Academic support designed to strengthen foundational skills and overcome difficulties." },
  { name: "Parent Counselling", slug: "parent-counselling", description: "Helping parents understand, support and guide their child's developmental journey." }
];

async function main() {
  console.log("Upserting services...");
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { name: s.name, description: s.description },
      create: { name: s.name, slug: s.slug, description: s.description }
    });
  }
  console.log("Done.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
