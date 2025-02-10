import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <div 
    className="flex-grow flex flex-col items-center bg-center bg-cover select-none space-y-16" 
    style={{ backgroundImage: "url('/images/istockphoto-1499955814-612x612.jpg')" }}
    >
      <div className="flex flex-col items-center space-y-2 mt-24">
        <h1 className="text-3xl sm:text-4xl text-gray-900 font-bold">
          さくら卯の里４丁目店
        </h1>
        <h2 className="text-2xl sm:text-3xl text-gray-900 font-semibold">
          予約情報一覧
        </h2>
        <h2 className="text-2xl sm:text-3xl text-red-700 font-semibold bg-white p-2">
          社外秘
        </h2>
      </div>
      <div>
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
  );
}
