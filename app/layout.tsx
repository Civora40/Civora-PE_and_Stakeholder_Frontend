import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Civora | Intelligent Construction. Clearer Control.",
  description:
    "Bring construction site submissions, review workflows, and project reporting into one structured workspace with Civora.",
  openGraph: {
    title: "Bring Every Site Into Clearer View | Civora",
    description:
      "Centralize construction updates, review incoming information, track outstanding details, and prepare structured project reports with clearer accountability.",
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  keywords: [
    "construction reporting",
    "site submissions",
    "review workflows",
    "project reports",
    "construction quality assurance",
  ],
  authors: [{ name: "Civora" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full bg-white overflow-x-hidden">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#001237] antialiased overflow-x-hidden selection:bg-[#4FAAA7]/30 selection:text-[#001237]">
        {children}
      </body>
    </html>
  );
}
