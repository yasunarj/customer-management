import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ユーザー用ダッシュボード",
  description: "ユーザー用のダッシュボードページです",
};

const UserDashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative w-full h-screen-vh overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full brightness-75 object-cover"
        src="/videos/5580_960x540.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="relative h-full z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default UserDashboardLayout;
