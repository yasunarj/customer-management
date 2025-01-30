"use client";
import { AlignJustify } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Link from "next/link";

const UserSheetMenu = ({ type }: { type: string }) => {
  console.log(type)  // デバック用
  return (
    <Sheet>
      <SheetTrigger>
        <AlignJustify />
      </SheetTrigger>
      <SheetContent className="w-[40%] sm:w-[20%] bg-blue-200">
        <SheetHeader>
          <SheetTitle className="text-center text-gray-800 text-2xl mt-2">
            Menu
          </SheetTitle>
        </SheetHeader>
        <nav className="flex justify-center mt-8">
          <ul className="flex flex-col space-y-4 text-gray-700 font-semibold text-md sm:text-xl">
            <li className="hover:text-blue-700 hover:underline hover:underline-offset-4 cursor-pointer">
              <Link href={"/user/dashboard"}>予約商材一覧へ</Link>
            </li>
            <li className="hover:text-blue-700 hover:underline hover:underline-offset-4 cursor-pointer">
              検索
            </li>
            <li className="hover:text-blue-700 hover:underline hover:underline-offset-4 cursor-pointer">
              アタックリスト
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default UserSheetMenu;
