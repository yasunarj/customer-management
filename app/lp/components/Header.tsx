"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetClose,
} from "@/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation";

const menuItems = [
  { href: "/lp#about", label: "ABOUT" },
  { href: "/lp#staff", label: "STAFF" },
  { href: "/lp/contact", label: "CONTACT" },
  { href: "/lp#recruit", label: "採用情報" },
];

const LandingPageHeader = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [menuImageLoaded, setMenuImageLoaded] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 2000);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const img = new window.Image();

    img.src = "/images/NavMenu.png";

    img.onload = () => {
      setMenuImageLoaded(true);
    };
  }, []);

  const handleDesktopNav = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("/lp#")) return;

    e.preventDefault();

    if (pathname !== "/lp") {
      router.push(href);
      return;
    }

    const id = href.replace("/lp#", "");
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50
      
    `}
    >
      <nav className={`w-full p-1 pr-0 sm:p-2 md:p-4 transition-opacity duration-500 ease-in-out pt-[env(safe-area-inset-top)] 
      h-[calc(100px+env(safe-area-inset-top))]
      bg-gradient-to-b from-white via-white/60 to-transparent
      backdrop-blur-md
      overflow-hidden
                      ${visible ? "opacity-100" : "opacity-0"}`}>
        <div
          className={`flex items-end gap-2 
                      `}
        >
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
                <Link href="/">
                  <span>さくら卯の里４丁目店</span>
                </Link>
              </h3>

              <ul className="flex sm:items-center text-sm lg:text-[16px] text-gray-800 font-semibold md:gap-6 lg:gap-12 gap-6 mr-6 lg:mr-12">
                <li className="hidden sm:block">
                  <Link
                    href="/lp#about"
                    onClick={(e) => handleDesktopNav(e, "/lp#about")}
                    className="hover:text-blue-500 hover:underline hover:underline-offset-4"
                  >
                    ABOUT
                  </Link>
                </li>
                <li className="hidden sm:block">
                  <Link
                    href="/lp#staff"
                    onClick={(e) => handleDesktopNav(e, "/lp#staff")}
                    className="hover:text-blue-500 hover:underline hover:underline-offset-4"
                  >
                    STAFF
                  </Link>
                </li>
                <li className="hidden sm:block">
                  <Link
                    href="/lp/contact"
                    onClick={(e) => handleDesktopNav(e, "/lp/contact")}
                    className="hover:text-blue-500 hover:underline hover:underline-offset-4"
                  >
                    CONTACT
                  </Link>
                </li>
                <li className="hidden sm:block">
                  <Link
                    href="/lp#recruit"
                    onClick={(e) => handleDesktopNav(e, "/lp#recruit")}
                    className="hover:text-blue-500 hover:underline hover:underline-offset-4"
                  >
                    採用情報
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <div className="sm:hidden fixed top-9 right-4 z-[60]">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="メニューを開く"
              className="bg-blue-400 p-0.5 rounded-sm transition-all duration-500 ease-in-out hover:rounded-lg hover:bg-blue-500 group"
            >
              <span className="block border-[0.5px]  border-white px-2 py-4 text-xs font-semibold text-white rounded-sm transition-all duration-500 ease-in-out group-hover:rounded-lg">
                MENU
              </span>
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-full sm:max-w-none border-none p-0 bg-transparent"
          >
            <SheetHeader>
              <SheetTitle className="sr-only">
                ナビゲーションメニュー
              </SheetTitle>
            </SheetHeader>

            <div className="relative h-full w-full overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/NavMenu.png')] bg-cover bg-center bg-no-repeat"></div>
              <div
                className="absolute inset-0 bg-black/55 pointer-events-none animate-[menuDim_600ms_ease-in-out_both]"
                style={{
                  animationDelay: "1000ms",
                }}
              />

              <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-16">
                <ul className="flex flex-col gap-8">
                  {menuItems.map((item, index) => {
                    const underlineDelay = 1600 + index * 150;
                    const textDelay = underlineDelay + 500;

                    return (
                      <li key={item.href}>
                        <SheetClose asChild>
                          <Link href={item.href} className="block">
                            <div className="overflow-hidden">
                              {/* テキスト */}
                              <p
                                className={`mt-3 text-3xl font-semibold tracking-wider text-white opacity-0 ${open && menuImageLoaded ? "animate-[textReveal_500ms_ease-out_forwards]" : ""}
                                        `}
                                style={{
                                  animationDelay: `${textDelay}ms`,
                                }}
                              >
                                {/* 下線 */}
                                {item.label}
                              </p>

                              <div
                                className={`h-[0.5px] bg-white origin-left scale-x-0 ${open && menuImageLoaded ? "animate-[lineReveal_500ms_ease-out_forwards]" : ""}`}
                                style={{
                                  animationDelay: `${underlineDelay}ms`,
                                }}
                              />
                            </div>
                          </Link>
                        </SheetClose>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default LandingPageHeader;

// ABOUT STAFF COMPANY 採用情報
