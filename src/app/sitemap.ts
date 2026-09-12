import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

const baseUrl = 'https://www.mylantern.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/specialists`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Fetch active specialists for dynamic routes
  try {
    const specialists = await prisma.specialist.findMany({
      where: { isActive: true },
      select: { id: true }
    });

    const specialistRoutes: MetadataRoute.Sitemap = specialists.map((spec) => ({
      url: `${baseUrl}/specialists/${spec.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...routes, ...specialistRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return routes;
  }
}
