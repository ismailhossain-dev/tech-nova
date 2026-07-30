import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechNova | Premier Electronics E-Commerce Platform",
  description: "Shop high-performance laptops, smartphones, 4K TVs, audio gear, and gaming consoles with official warranty & fast local shipping.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const initialTheme = themeCookie === "light" ? "light" : "dark";

  return (
    // <html lang="en" className={initialTheme === "dark" ? "dark" : ""}>
    <html lang="en" >
      <body className={`${inter.className} min-h-screen flex flex-col text-[#d7d7d7] font-sans  bg-[#181818] `}>
        <AuthProvider>
          <ThemeProvider initialTheme={initialTheme}>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
