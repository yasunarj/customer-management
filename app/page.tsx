import SplashScreen from "@/components/splashScreen/SplashScreen";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <SplashScreen />
      <div
        className="flex-grow flex flex-col items-start bg-center bg-cover select-none justify-end p-4 relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/photo-1719127516207-89c019911f80.avif')",
        }}
      >
        <div className="absolute top-8 left-6 sm:top-12 sm:left-10 md:top-20 md:left-20 flex flex-col space-y-4 sm:space-y-6 md:space-y-8 items-star w-[80%]">
          <h2 className="text-gray-200 text-3xl sm:text-4xl md:text-5xl font-bold">
            地域No1のお店を作り
          </h2>
          <h3 className="text-gray-200 text-2xl sm:text-3xl md:text-4xl font-semibold ml-12 sm:ml-16 md:ml-24">
            お客様の生活を豊かにする
          </h3>
        </div>
        <Link href="/auth/login" className="self-center mb-8 sm:mb-12">
            <Button
              className={`${cn(
                buttonVariants({ size: "lg", variant: "link" })
              )} px-8 py-6 font-bold text-white text-lg rounded-full bg-gradient-to-r from-black via-gray-800 to-gray-600`}
            >
              予約商材一覧へ
            </Button>
          </Link>
      </div>
    </>
  );
}
