import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ユーザー用ダッシュボード",
  description: "ユーザー用のダッシュボードページです",
};

const UserDashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="flex-grow bg-center bg-cover select-none flex justify-center items-center"
      style={{
        backgroundImage: "url('/images/photo-1735303937312-381ad640f71e.avif')",
      }}
    >
      {children}
    </div>
  );
};

export default UserDashboardLayout;
