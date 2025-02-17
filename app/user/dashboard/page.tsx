"use client";
import { useRouter } from "next/navigation";
import { adminItems } from "@/lib/adminItems";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
const UserDashboardPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleNavigation = (type: string) => {
    setIsLoading(true);
    router.push(`/user/${type}/list`);
  };

  return (
    <>
      <Dialog open={isLoading}>
        <DialogContent className="flex flex-col items-center justify-center p-10">
          <DialogTitle className="sr-only">ページ遷移中</DialogTitle>
          <Loader2 className="w-12 h-12 animate-spin text-gray-800" />
          <p className="mt-4 text-lg font-semibold text-gray-700">読み込み中</p>
        </DialogContent>
      </Dialog>

      <div className="w-[95%] h-[95%] lg:max-w-[1024px] bg-white rounded-xl shadow-4xl">
        <div className="flex flex-col items-center gap-12 sm:gap-24 p-24">
          <div className="space-y-2 text-center">
            <h1 className="hidden sm:block sm:text-4xl lg:text-5xl text-gray-800 font-bold">
              予約商材を選択してください
            </h1>
            <h1 className="sm:hidden text-3xl font-bold text-gray-800">
              予約商材一覧
            </h1>
          </div>
          <div>
            <ul className="flex flex-col gap-6 sm:gap-12 text-3xl sm:text-4xl text-gray-600 font-bold">
              {adminItems.map((item) => {
                return (
                  <li key={item.type}>
                    <button
                      className="hover:underline hover:underline-offset-4 hover:text-blue-800"
                      onClick={() => handleNavigation(item.type)}
                    >
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboardPage;
