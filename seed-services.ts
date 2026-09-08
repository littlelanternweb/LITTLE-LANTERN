import { PrismaClient } from '@prisma/client'
import * as fs from "fs";

// Load .env manually
const envContent = fs.readFileSync(".env", "utf8");
for (const line of envContent.split("\n")) {
  if (line.trim() && !line.startsWith("#")) {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join("=").trim().replace(/^["'](.*)["']$/, '$1');
    }
  }
}

const prisma = new PrismaClient()

const services = [
  { title: "Child Counselling", slug: "child-counselling" },
  { title: "Adolescent Counselling", slug: "adolescent-counselling" },
  { title: "Parent Counselling", slug: "parent-counselling" },
  { title: "Family Counselling", slug: "family-counselling" },
  { title: "Behaviour Therapy", slug: "behaviour-therapy" },
  { title: "Psychological Assessment", slug: "psychological-assessment" },
  { title: "Developmental Assessment", slug: "developmental-assessment" },
  { title: "Learning Assessment", slug: "learning-assessment" },
  { title: "Special Education", slug: "special-education" },
  { title: "Remedial Education", slug: "remedial-education" },
  { title: "Speech & Language Support", slug: "speech-language-support" },
  { title: "Occupational Therapy", slug: "occupational-therapy" },
  { title: "ABA Therapy", slug: "aba-therapy" },
  { title: "Play Therapy", slug: "play-therapy" },
  { title: "Social Skills Training", slug: "social-skills-training" },
  { title: "Life Skills Training", slug: "life-skills-training" },
  { title: "ADHD Support", slug: "adhd-support" },
  { title: "Autism Support", slug: "autism-support" },
  { title: "Learning Disability Support", slug: "learning-disability-support" },
  { title: "Career Counselling", slug: "career-counselling" }
];

async function main() {
  console.log("Seeding services...");
  
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { name: s.title },
      create: { 
        name: s.title, 
        slug: s.slug, 
        description: `Professional ${s.title} tailored for individual needs.` 
      }
    });
  }
  
  console.log("Services seeded successfully.");
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
