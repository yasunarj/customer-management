"use client";

import { useFadeInOnView } from "@/hooks/useFadeInOnView";
import OwnerIntroduction from "./OwnerIntroduction";
import StaffIntroduction from "./StaffIntroduction";

const AboutTeam = () => {
  const title = useFadeInOnView();

  return (
    <div className="-mx-4">
      <div style={{ backgroundColor: "#282828" }}>
        <div className="h-[60px] sm:h-[80px] md:h-[100px] rounded-br-full bg-gray-50"></div>
      </div>
      <header
        className="h-[60px] sm:h-[80px] md:h-[100px] rounded-tl-full"
        style={{ backgroundColor: "#282828" }}
      ></header>
      <main
        className="h-[1260px] md:h-[1420px] lg:h-[1440px] xl:h-[1500px] px-4 lg:px-8"
        style={{ backgroundColor: "#282828" }}
      >
        <div className="max-w-[1360px] mx-auto">
          <div
            ref={title.ref}
            className={`-mx-4 transition-all duration-500 transform ${
              title.isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <h2 className="relative pl-8 text-2xl md:text-3xl xl:text-4xl font-semibold text-white overflow-hidden lg:-mr-4">
              さくら卯の里店 チーム紹介
              <span className="absolute w-full left-8 bottom-0 h-[2px] bg-white sm:bm-0"></span>
            </h2>
          </div>
          <OwnerIntroduction />
          <StaffIntroduction />
        </div>
      </main>
      <footer className="h-[60px] sm:h-[80px] md:h-[100px] bg-gray-200">
        <div
          className="h-full rounded-br-full"
          style={{ backgroundColor: "#282828" }}
        ></div>
      </footer>
      <div style={{ backgroundColor: "#282828" }}>
        <div className="h-[60px] sm:h-[80px] md:h-[100px] rounded-tl-full bg-gray-200"></div>
      </div>
    </div>
  );
};

export default AboutTeam;
