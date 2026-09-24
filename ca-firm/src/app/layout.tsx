import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sharma & Associates — Chartered Accountants",
    template: "%s | Sharma & Associates CA",
  },
  description:
    "Trusted Chartered Accountant firm offering GST compliance, income tax filing, statutory audit, and company incorporation services across India. ICAI registered.",
  keywords: [
    "chartered accountant",
    "CA firm",
    "GST filing",
    "income tax",
    "statutory audit",
    "company incorporation",
    "Mumbai CA",
    "tax consultant",
  ],
  authors: [{ name: "Sharma & Associates" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Sharma & Associates, Chartered Accountants",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
