import {
  Toilet,
  Landmark,
  Cigarette,
  Wine,
  Truck,
  CupSoda,
  Package,
  Printer,
  GlassWater,
} from "lucide-react";

const AboutService = () => {
  return (
    <div className="flex flex-wrap gap-y-2 sm:gap-y-4 gap-4 sm:gap-8">
      <div className="flex gap-1 md:gap-2 items-center">
        <div className="border border-green-500 p-1 rounded-full">
          <Landmark className="text-green-500 w-4 h-4 md:w-8 md:h-8" />
        </div>
        <span className="text-gray-700 text-sm md:text-[16px]">ATM</span>
      </div>
      <div className="flex gap-1 md:gap-2 items-center">
        <div className="border border-blue-400 p-1 rounded-full">
          <Toilet className="text-blue-400 w-4 h-4 md:w-8 md:h-8" />
        </div>
        <span className="text-gray-700 text-sm md:text-[16px]">トイレ</span>
      </div>
      <div className="flex gap-1 md:gap-2 items-center">
        <div className="border border-red-500 p-1 rounded-full">
          <Wine className="text-red-500 w-4 h-4 md:w-8 md:h-8" />
        </div>
        <span className="text-gray-700 text-sm md:text-[16px]">お酒</span>
      </div>
      <div className="flex gap-1 md:gap-2 items-center">
        <div className="border border-gray-500 p-1 rounded-full">
          <Cigarette className="text-gray-500 w-4 h-4 md:w-8 md:h-8" />
        </div>
        <span className="text-gray-700 text-sm md:text-[16px]">たばこ</span>
      </div>
      <div className="flex gap-1 md:gap-2 items-center">
        <div className="border border-yellow-700 p-1 rounded-full">
          <Truck className="text-yellow-700 w-4 h-4 md:w-8 md:h-8" />
        </div>
        <span className="text-gray-700 text-sm md:text-[16px]">
          セブンミール
        </span>
      </div>
      <div className="flex gap-1 md:gap-2 items-center">
        <div className="border border-blue-900 p-1 rounded-full">
          <Package className="text-blue-900 w-4 h-4 md:w-8 md:h-8" />
        </div>
        <span className="text-gray-700 text-sm md:text-[16px]">
          店舗留置サービス
        </span>
      </div>
      <div className="flex gap-1 md:gap-2 items-center">
        <div className="border border-black p-1 rounded-full">
          <Printer className="text-black w-4 h-4 md:w-8 md:h-8" />
        </div>
        <span className="text-gray-700 text-sm md:text-[16px]">
          マルチコピー機
        </span>
      </div>
      <div className="flex gap-1 md:gap-2 items-center">
        <div className="border border-red-950 p-1 rounded-full">
          <CupSoda className="text-red-950 w-4 h-4 md:w-8 md:h-8" />
        </div>
        <span className="text-gray-700 text-sm md:text-[16px]">
          セブンカフェ
        </span>
      </div>
      <div className="flex gap-1 md:gap-2 items-center">
        <div className="border border-pink-400 p-1 rounded-full">
          <GlassWater className="text-pink-400 w-4 h-4 md:w-8 md:h-8" />
        </div>
        <span className="text-gray-700 text-sm md:text-[16px]">
          セブンカフェスムージー
        </span>
      </div>
    </div>
  );
};

export default AboutService;
