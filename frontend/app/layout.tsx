import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NavbarWrapper } from "@/components/navbar-wrapper";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Veras Dashboard",
  description: "Monitor and verify your AI agent traces",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <ClerkProvider signInFallbackRedirectUrl="/">          
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <NavbarWrapper />
            <main className="min-h-screen">{children}</main>
          </ThemeProvider>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
