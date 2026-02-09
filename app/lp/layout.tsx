import { ReactNode } from "react";
import { Metadata } from "next";
import LandingPageHeader from "./components/Header";
import LandingPageFooter from "./components/Footer";
import ViewportVar from "./components/ViewportVar";

export const metadata: Metadata = {
  title: "セブンイレブンさくら卯の里4丁目店 | LP",
  description:
    "さくら卯の里4丁目店のサービスや商品、お店で働くスタッフを紹介するLPサイトです",
};

const LandingPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="antialiased flex flex-col min-h-[100dvh] [--lp-header-h:100px] [--vvh:100vh]">
      <ViewportVar />
      <LandingPageHeader />
      <main className="pt-[var(--lp-header-h)] flex-1">{children}</main>
      <LandingPageFooter />
    </div>
  );
};

export default LandingPageLayout;
