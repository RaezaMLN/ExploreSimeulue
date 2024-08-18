// src/app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import ClientSideLayout from "./ClientSideLayout";
import Head from "next/head";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Explore Simeulue",
  description: "Promoting the beauty of Simeulue Island",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>Explore Simeulue</title>
        <meta name="description" content="Promoting the beauty of Simeulue Island" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>
      <body className={inter.className}>
        <ClientSideLayout>{children}</ClientSideLayout>
      </body>
    </html>
  );
}
