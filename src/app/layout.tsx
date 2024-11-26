import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Toploader from "nextjs-toploader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Toploader color="#4B76C9" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
