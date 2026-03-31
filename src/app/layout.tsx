import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Content Site",
    default: "Content Site",
  },
  description: "Expert guides and in-depth articles",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Content Site",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <header className="border-b border-gray-200">
          <nav className="mx-auto max-w-4xl px-4 py-4">
            <Link href="/" className="text-xl font-bold">
              Content Site
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 mt-16">
          <div className="mx-auto max-w-4xl px-4 py-6 text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Content Site
          </div>
        </footer>
      </body>
    </html>
  );
}
