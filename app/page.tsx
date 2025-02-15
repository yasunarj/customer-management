import SplashScreen from "@/components/splashScreen/SplashScreen";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <SplashScreen />
    <div 
    className="flex-grow flex flex-col items-center bg-center bg-cover select-none space-y-16" 
    style={{ backgroundImage: "url('/images/photo-1719127516207-89c019911f80.avif')" }}
    >
      <div className="flex flex-col items-center space-y-4 mt-24">
        <h1 className="text-3xl sm:text-4xl text-gray-300 font-bold font-orbitron">
          さくら卯の里４丁目店
        </h1>
        <Link href="/auth/login">
          <Button
            className={`${cn(
              buttonVariants({ size: "lg" })
            )} font-bold text-lg`}
          >
            予約商材一覧へ
          </Button>
        </Link>
      </div>
    </div>
    </>
  );
}
