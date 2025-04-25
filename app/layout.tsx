import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  IBM_Plex_Sans_JP,
  Playfair_Display,
  // Zen_Kaku_Gothic_New,
  // Montserrat,
  // Poppins,
  // Lato,
  // Noto_Sans_JP,
  // M_PLUS_1p,
  Oswald,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { getPathnameFromHeaders } from "@/lib/headers";
import ClientPathChecker from "@/components/clientPath/ClientPathChecker";

export const metadata: Metadata = {
  title: "さくら卯の里４丁目店 顧客管理アプリ",
  description:
    "セブンイレブンの予約商材の管理を紙から、Next.jsを使用したアプリにしました",
  keywords: [
    "顧客管理",
    "予約管理",
    "クリスマスケーキ",
    "おせち",
    "恵方巻き",
    "Next.js",
    "Supabase",
  ],
  authors: [
    {
      name: "セブンイレブンさくら卯の里4丁目店",
      url: "customer-management-delta.vercel.app",
    },
  ],
  openGraph: {
    title: "さくら卯の里4丁目店",
    description:
      "さくら卯の里店の予約商品商材の管理を簡単に行える顧客管理アプリです。",
    type: "website",
    url: "customer-management-delta.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    site: "",
    title: "さくら卯の里4丁目店 顧客管理アプリ",
    description: "クリスマスケーキや恵方巻きの予約を管理する便利なアプリです。",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});


const ibmPlexSansJP = IBM_Plex_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-sans-jp",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair-display",
})

// const zenKakuGothic = Zen_Kaku_Gothic_New({
//   subsets: ["latin"],
//   weight: ["400", "700"],
//   variable: "--font-zen-kaku-gothic",
// });

// const montserrat = Montserrat({
//   subsets: ["latin"],
//   variable: "--font-montserrat",
// });

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "700"],
//   variable: "--font-poppins",
// });

// const lato = Lato({
//   subsets: ["latin"],
//   weight: ["400", "700"],
//   variable: "--font-lato",
// });

// const notoSansJP = Noto_Sans_JP({
//   subsets: ["latin"],
//   weight: ["400", "700"],
//   variable: "--font-noto-sans-jp",
// });

// const mPlus1p = M_PLUS_1p({
//   subsets: ["latin"],
//   weight: ["400", "700"],
//   variable: "--font-m-plus-1p",
// });

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-oswald",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await getPathnameFromHeaders()) || "/";
  const isLP = pathname.startsWith("/lp");

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfairDisplay.variable} ${geistSans.variable} ${geistMono.variable} ${oswald.variable} ${ibmPlexSansJP.variable} first-line:antialiased flex flex-col h-screen-vh`}
      >
        <ClientPathChecker />
        {!isLP && <Header />}
        {children}
        {!isLP && <Footer />}
      </body>
    </html>
  );
}

// ${montserrat.variable}
// ${poppins.variable} 
// ${lato.variable}
// ${notoSansJP.variable}
// ${mPlus1p.variable}
// ${zenKakuGothic.variable}
// ${ibmPlexSansJP.variable}
