import HomeSplashScreen from "@/components/splashScreen/HomeSplashScreen";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <HomeSplashScreen />
      <div
        className="flex-grow flex flex-col items-start bg-center bg-cover select-none justify-end p-4 relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/images/photo-1719127516207-89c019911f80.avif')",
        }}
      >
        <div className="absolute top-12 left-6 sm:top-12 sm:left-10 md:top-20 md:left-20 flex flex-col space-y-4 sm:space-y-6 md:space-y-8 items-star w-[80%] hide-when-short">
          <h2 className="text-gray-300 text-2xl sm:text-4xl md:text-5xl font-bold">
            地域No1のお店を作り
          </h2>
          <h3 className="text-gray-300 text-2xl sm:text-3xl md:text-4xl font-semibold ml-8 sm:ml-16 md:ml-24">
            お客様には最高の満足を
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-8 lg:gap-12 self-center mb-4 w-[200px] sm:w-[480px] lg:w-[860px]">
          <Link href="/lp">
            <Button
              className={`${cn(
                buttonVariants({ size: "lg", variant: "link" }),
              )}  w-full px-8 py-6 font-bold text-white text-lg rounded-md bg-gradient-to-r from-black via-gray-800 to-gray-600`}
            >
              店舗紹介ページへ
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button
              className={`${cn(
                buttonVariants({ size: "lg", variant: "link" }),
              )} w-full px-8 py-6 font-bold text-white text-lg rounded-md bg-gradient-to-r from-black via-gray-800 to-gray-600`}
            >
              予約商材一覧へ
            </Button>
          </Link>
          <Link href="/safe">
            <Button
              className={`${cn(
                buttonVariants({ size: "lg", variant: "link" }),
              )} w-full px-8 py-6 font-bold text-white text-lg rounded-md bg-gradient-to-r from-black via-gray-800 to-gray-600`}
            >
              金庫管理ページへ
            </Button>
          </Link>
          <Link href="/expiry">
            <Button
              className={`${cn(
                buttonVariants({ size: "lg", variant: "link" }),
              )} w-full px-8 py-6 font-bold text-white text-lg rounded-md bg-gradient-to-r from-black via-gray-800 to-gray-600`}
            >
              鮮度管理ページへ
            </Button>
          </Link>
          <Link href="/daily-check">
            <Button
              className={`${cn(
                buttonVariants({ size: "lg", variant: "link" }),
              )} w-full px-8 py-6 font-bold text-white text-lg rounded-md bg-gradient-to-r from-black via-gray-800 to-gray-600`}
            >
              オーナータスク
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
