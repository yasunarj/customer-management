"use client";
import { useRouter } from "next/navigation";
import { adminItems } from "@/lib/adminItems";
import { useState } from "react";
import CarouselDashboard from "@/components/carousel/CarouselDashboard";
import LoadingDialog from "@/components/dialog/LoadingDialog";

const UserDashboardPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleNavigation = (type: string) => {
    setIsLoading(true);
    router.push(`/user/${type}/list`);
  };

  return (
    <>
      <LoadingDialog isLoading={isLoading} />

      <div className="overflow-y-auto w-[90%] h-[55%] sm:h-[62%] md:h-[72%] lg:h-[70%] lg:max-w-[1024px] bg-white/70 rounded-xl shadow-4xl">
        <div className="flex flex-col items-center gap-8 sm:gap-12 md:gap-16 p-12">
          <div className="space-y-2 text-center">
            <h1 className="hidden sm:block sm:text-4xl lg:text-5xl text-gray-800 font-bold">
              予約商材を選択してください
            </h1>
            <h1 className="sm:hidden text-3xl font-bold text-gray-800">
              予約商材一覧
            </h1>
          </div>
          <CarouselDashboard items={adminItems} handleNavigation={handleNavigation} />
        </div>
      </div>
    </>
  );
};

export default UserDashboardPage;
