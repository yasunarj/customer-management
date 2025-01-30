"use client";
import Link from "next/link";
import { AlignJustify } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const SheetMenu = ({ type }: { type: string }) => {
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
          <ul className="flex flex-col space-y-6 text-gray-700 font-semibold text-md sm:text-xl">
            <li className="hover:text-blue-700 hover:underline hover:underline-offset-4 cursor-pointer">
              <Link href={"/admin/dashboard"}>予約商材一覧へ</Link>
            </li>
            <li className="hover:text-blue-700 hover:underline hover:underline-offset-4 cursor-pointer">
              <Link href={`/admin/${type}/new/`}>新規登録</Link>
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

export default SheetMenu;
