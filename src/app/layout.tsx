import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { FloatingActions } from "@/components/layout/FloatingActions";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Little Lantern | Child Consultation Centre",
  description: "Expert guidance for every child's unique journey. A premium child consultation centre.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full scroll-smooth ${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} min-h-full flex flex-col bg-background text-foreground antialiased`}>
        <Navbar />
        <FloatingActions />
        <main className="flex-grow w-full overflow-x-hidden">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
