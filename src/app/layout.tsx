import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { FloatingActions } from "@/components/layout/FloatingActions";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

export const metadata: Metadata = {
  title: {
    default: "Little Lantern | Child Consultation Centre in Wandoor, Kerala",
    template: "%s | Little Lantern",
  },
  description: "A premium child consultation centre in Wandoor, Kerala. Expert guidance in child counselling, special education, speech therapy, and psychometric testing.",
  keywords: [
    "Child Consultation Centre", "Child Psychology", "Special Educator", 
    "Speech Therapy", "Child Counselling", "Psychometric Testing", 
    "Career Counselling", "Wandoor", "Kerala", "Little Lantern"
  ],
  authors: [{ name: "Little Lantern" }],
  creator: "Little Lantern",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.mylantern.in",
    title: "Little Lantern | Child Consultation Centre in Wandoor, Kerala",
    description: "Expert guidance for every child's unique journey. A premium child consultation centre in Wandoor, Kerala.",
    siteName: "Little Lantern",
  },
  twitter: {
    card: "summary_large_image",
    title: "Little Lantern | Child Consultation Centre",
    description: "Expert guidance for every child's unique journey. A premium child consultation centre in Wandoor, Kerala.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full scroll-smooth ${inter.variable}`}>
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
