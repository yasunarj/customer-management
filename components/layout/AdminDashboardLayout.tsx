"use client";

import { useState } from "react";
import { ReactNode } from "react";
import DashboardSplashScreen from "@/components/splashScreen/DashboardSplashScreen";
const AdminDashboardLayout = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <DashboardSplashScreen />
      <div className="relative w-full h-screen-vh overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover brightness-75"
          src="/videos/5580_960x540 (1).mp4"
          onLoadedData={() => setIsLoading(true)}
          loop
          autoPlay
          muted
          playsInline
        />
        {isLoading && (
          <div className="relative z-10 h-full flex justify-center items-center">
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboardLayout;
