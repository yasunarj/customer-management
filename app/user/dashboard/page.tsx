"use client";
import { useRouter } from "next/navigation";
import { adminItems } from "@/lib/adminItems";
const UserDashboardPage = () => {
  const router = useRouter();
  const handleNavigation = (type: string) => {
    router.push(`/user/${type}/list`);
  };

  return (
    <div
      className="flex-grow bg-center bg-cover select-none flex justify-center items-center"
      style={{
        backgroundImage: "url('/images/istockphoto-1499955814-612x612.jpg')",
      }}
    >
      <div className="w-[95%] h-[95%] bg-white rounded-xl shadow-4xl"> 
        <div className="flex flex-col items-center gap-12 sm:gap-24 p-24">
          <div className="space-y-6 text-center">
            <h1 className="text-2xl sm:text-5xl text-gray-800 font-bold">
              予約商材を選択してください
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
    </div>
  );
};

export default UserDashboardPage;