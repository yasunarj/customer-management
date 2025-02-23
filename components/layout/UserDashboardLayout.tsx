"use client";
import type { Metadata } from "next";
import { ReactNode, useEffect } from "react";
import { useState } from "react";
import DashboardSplashScreen from "../splashScreen/DashboardSplashScreen";

export const metadata: Metadata = {
  title: "ユーザー用ダッシュボード",
  description: "ユーザー用のダッシュボードページです",
};

const UserDashboardLayout = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSplashVisible, setIsSplashVisible] = useState<boolean>(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <DashboardSplashScreen />
      {isSplashVisible && (
        <div className="relative w-full h-screen-vh overflow-hidden">
          <video
            className="absolute top-0 left-0 w-full h-full brightness-75 object-cover"
            src="/videos/5580_960x540.mp4"
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsLoading(true)}
          />
          {isLoading && (
            <div className="relative h-full z-10 flex items-center justify-center">
              {children}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserDashboardLayout;
