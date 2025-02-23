"use client";
import { useRouter } from "next/navigation";
import { adminItems } from "@/lib/adminItems";
import { useState } from "react";
import LoadingDialog from "@/components/dialog/LoadingDialog";
import CarouselDashboard from "@/components/carousel/CarouselDashboard";

const AdminDashboardPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleNavigation = (type: string) => {
    setIsLoading(true);
    router.push(`/admin/${type}/list`);
  };

  return (
    <>
      <LoadingDialog isLoading={isLoading} />

        <div className="overflow-y-auto w-[90%] h-[60%] sm:h-[65%] md:h-[72%] lg:max-w-[1024px] bg-white/70 rounded-xl shadow-4xl">
          <div className="flex flex-col items-center gap-4 p-12">
            <div className="space-y-2 text-center">
              <h1 className="hidden sm:block sm:text-4xl lg:text-5xl text-gray-800 font-bold">
                予約商材を選択してください
              </h1>
              <h1 className="sm:hidden text-3xl font-bold text-gray-800">
                予約商材一覧
              </h1>
              <h2 className="text-xl sm:text-3xl text-gray-800 font-semibold">
                (管理者用)
              </h2>
            </div>
            <CarouselDashboard items={adminItems} handleNavigation={handleNavigation} />
          </div>
        </div>
    </>
  );
};

export default AdminDashboardPage;
