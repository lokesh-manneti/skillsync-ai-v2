import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

// 1. Setup Fonts
const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter',
  display: 'swap'
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "SkillSync AI | Your Career Copilot",
  description: "AI-powered resume analysis and personalized learning roadmaps.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 selection:bg-brand-100 selection:text-brand-900">
        {children}
      </body>
    </html>
  );
}