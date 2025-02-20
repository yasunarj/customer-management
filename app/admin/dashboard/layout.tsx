import { ReactNode } from "react";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "管理者用ダッシュボード",
  description: "管理者用の内容のページになります",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
};

export default Layout;
