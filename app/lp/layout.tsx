import { ReactNode } from "react";
import { Metadata } from "next";
import LandingPageHeader from "./components/Header";
import LandingPageFooter from "./components/Footer";
import ClientWrapper from "./components/ClientWrapper";

export const metadata: Metadata = {
  title: "セブンイレブンさくら卯の里4丁目店 | LP",
  description:
    "さくら卯の里4丁目店のサービスや商品、お店で働くスタッフを紹介するLPサイトです",
};

const LandingPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ClientWrapper>
      <div className="antialiased flex flex-col h-full">
        <LandingPageHeader />
        <main className="relative flex-1">
          {children}
          <LandingPageFooter />
        </main>
      </div>
    </ClientWrapper>
  );
};

export default LandingPageLayout;
