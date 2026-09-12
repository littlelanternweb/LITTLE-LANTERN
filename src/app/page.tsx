import { HomeClient } from "@/components/home/HomeClient";
import { prisma } from "@/lib/db";

export const revalidate = 60; // ISR for homepage

export default async function Home() {
  // Fetch a few featured specialists for the homepage
  const specialists = await prisma.specialist.findMany({
    where: { isActive: true },
    include: { services: true },
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    take: 4,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: "Little Lantern",
    image: "https://www.mylantern.in/logo.jpg",
    "@id": "https://www.mylantern.in",
    url: "https://www.mylantern.in",
    telephone: "+919961757373",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Little Lantern",
      addressLocality: "Wandoor",
      addressRegion: "Kerala",
      postalCode: "679328",
      addressCountry: "IN"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 11.1925, // Note: replace with exact Wandoor lat/lng if available
      longitude: 76.2361
    },
    medicalSpecialty: [
      "Child Psychology",
      "Special Education",
      "Speech Therapy",
      "Psychiatric Testing"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient specialists={specialists} />
    </>
  );
}
