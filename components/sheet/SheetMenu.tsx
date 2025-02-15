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

interface SheetMenuProps {
  menuList: {listName: string, link: string}[]
}

const SheetMenu = ({ menuList }: SheetMenuProps) => {
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
          <ul className="flex flex-col space-y-6 text-gray-700 font-semibold text-md md:text-lg lg:text-xl">
            { menuList.map((list) => {
              return <li key={list.listName} className="hover:text-blue-700 hover:underline hover:underline-offset-4 cursor-pointer"><Link href={list.link}>{list.listName}</Link></li>
            }) }
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SheetMenu;
