import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "管理者用ダッシュボード",
  description: "管理者用の内容のページになります"
}

const AdminDashboardLayout = ({children}: { children: ReactNode }) => {
  return (
    
    <div
    className="flex-grow bg-center bg-cover select-none flex justify-center items-center"
    style={{
      backgroundImage: "url('/images/photo-1735303937312-381ad640f71e.avif')", // cSpell: disable-line
    }}
  >
      {children}
    </div>
  );
};

export default AdminDashboardLayout