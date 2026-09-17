import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  try {
    const specialist = await prisma.specialist.findUnique({
      where: { id: params.id },
      select: { imageUrl: true }
    });

    if (!specialist || !specialist.imageUrl) {
      return new NextResponse(null, { status: 404 });
    }

    // Check if it's a base64 string
    const match = specialist.imageUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (match) {
      const mimeType = match[1];
      const base64Data = match[2];
      const buffer = Buffer.from(base64Data, 'base64');
      
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": mimeType,
          "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        }
      });
    }

    // If it's a regular URL (e.g. uploaded somewhere else), redirect to it
    if (specialist.imageUrl.startsWith("http") || specialist.imageUrl.startsWith("/")) {
      return NextResponse.redirect(new URL(specialist.imageUrl, req.url));
    }

    return new NextResponse(null, { status: 404 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
