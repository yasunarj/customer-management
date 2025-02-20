import { ReactNode } from "react";
import UserDashboardLayout from "@/components/layout/UserDashboardLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ユーザー用ダッシュボード",
  description: "ユーザー用のダッシュボードページです"
}

const Layout = ({ children }: { children: ReactNode }) => {
  return <UserDashboardLayout>{children}</UserDashboardLayout>;
};

export default Layout;
