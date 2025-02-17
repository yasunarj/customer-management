import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "さくら卯の里４丁目店 顧客管理アプリ",
  description: "セブンイレブンの予約商材の管理を紙から、Next.jsを使用したアプリにしました",
  keywords: ["顧客管理", "予約管理", "クリスマスケーキ", "おせち", "恵方巻き", "Next.js", "Supabase"],
  authors: [{name: "セブンイレブンさくら卯の里4丁目店", url: "customer-management-delta.vercel.app"}],
  openGraph: {
    title: "さくら卯の里4丁目店",
    description: "さくら卯の里店の予約商品商材の管理を簡単に行える顧客管理アプリです。",
    type: "website",
    url: "customer-management-delta.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    site: "",
    title: "さくら卯の里4丁目店 顧客管理アプリ",
    description: "クリスマスケーキや恵方巻きの予約を管理する便利なアプリです。"
  }
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen-vh`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
