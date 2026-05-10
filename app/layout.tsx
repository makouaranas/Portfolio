import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, themeBootScript } from "../components/ThemeProvider";
import LoadingWrapper from "../components/LoadingWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAKOUAR Anas — Electrical Engineer & Full Stack Developer",
  description:
    "Portfolio of MAKOUAR Anas — full-stack web development, AI integration, and embedded systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-sans)]`}
        style={{ background: "var(--bg)", color: "var(--fg)" }}
      >
        <ThemeProvider>
          <LoadingWrapper>{children}</LoadingWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
