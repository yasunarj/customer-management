"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const LandingPageHeader = () => {
  const [visible, setVisible] = useState<boolean>(false);
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 2000);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.addEventListener("scroll", handleScroll);
  }, []);
  return (
    <header
      className={`fixed w-full top-0 left-0 p-1 pr-0 sm:p-2 md:p-4 bg-gradient-to-b from-white via-white/60 to-transparent backdrop-blue-md z-50 overflow-hidden transition-opacity duration-500 ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <nav className="h-[100px]">
        <div className="flex items-end gap-2">
          <Image
            src={"/images/logo_food.png"}
            alt="LPのheaderロゴ"
            width={80}
            height={80}
          />
          <div className="w-full flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="w-full border-[4px] border-red-600"></div>
              <div className="w-[70%] border-[3px] border-green-500"></div>
              <div className="w-[30%] border-[2px] border-orange-400"></div>
            </div>
            <div className="flex w-full justify-between">
              <h3 className="flex flex-col text-lg sm:text-xl  md:text-2xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-transparent bg-clip-text mb-1">
                <Link href="/lp">
                  <span>さくら卯の里４丁目店</span>
                </Link>
              </h3>

              <ul className="flex sm:items-center text-sm lg:text-[16px] text-gray-800 font-semibold md:gap-6 lg:gap-12 gap-6 mr-6 lg:mr-12">
                <li className="hidden sm:block">
                  <Link
                    href="/lp#about"
                    className="hover:text-blue-500 hover:underline hover:underline-offset-4"
                  >
                    ABOUT
                  </Link>
                </li>
                <li className="hidden sm:block">
                  <Link
                    href="/lp#staff"
                    className="hover:text-blue-500 hover:underline hover:underline-offset-4"
                  >
                    STAFF
                  </Link>
                </li>
                <li className="hidden sm:block">
                  <Link
                    href="/lp/contact"
                    className="hover:text-blue-500 hover:underline hover:underline-offset-4"
                  >
                    CONTACT
                  </Link>
                </li>
                <li className="hidden sm:block">
                  <Link
                    href="/lp#recruit"
                    className="hover:text-blue-500 hover:underline hover:underline-offset-4"
                  >
                    採用情報
                  </Link>
                </li>
              </ul>
              <div className="flex flex-col relative sm:hidden right-4 top-[-6px] cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-menu sm:hidden"
                >
                  <line x1="4" x2="24" y1="12" y2="12" />
                  <line x1="4" x2="24" y1="6" y2="6" />
                  <line x1="4" x2="24" y1="18" y2="18" />
                </svg>
                <p className="text-[11px] absolute bottom-0 left-[2px]">menu</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default LandingPageHeader;

// ABOUT STAFF COMPANY 採用情報
