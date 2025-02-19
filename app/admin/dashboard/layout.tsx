import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "管理者用ダッシュボード",
  description: "管理者用の内容のページになります"
}

const AdminDashboardLayout = ({children}: { children: ReactNode }) => {
  return (
    <div className="relative w-full h-screen-vh overflow-hidden">
      <video 
        className="absolute top-0 left-0 w-full h-full object-cover brightness-75"
        src="/videos/5580_960x540.mp4"
        loop
        autoPlay
        muted
        playsInline
      />
      <div className="relative z-10 h-full flex justify-center items-center">{children}</div>
    </div>
  );
};

export default AdminDashboardLayout