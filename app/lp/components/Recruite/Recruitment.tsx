"use client";
import Link from "next/link";
import RecruitButton from "./RecruitButton";

const Recruitment = () => {
  return (
    <div id="recruit" className="scroll-mt-20 h-[540px] lg:h-[360px] pt-12 bg-gray-200 -mx-4">
      <div className="pl-8  max-w-[1500px] mx-auto">
        <h2 className="relative font-bold lg:px-4 text-2xl md:text-4xl xl:text-5xl text-gray-800 overflow-hidden">
          採用情報
          <span className="absolute w-full left-0 lg:left-4 bottom-0 h-[2px] bg-black"></span>
        </h2>
        <div className="mt-12 lg:flex items-center gap-4 xl:gap-24">
          <div>
            <p className="leading-relaxed font-semibold text-sm md:text-[16px] lg:text-lg lg:px-4 text-gray-800">
              年齢・国籍・経験は問いません。
              <br />
              やる気と元気だけあればどなたでもご応募いただけます。
              <br />
              さくら卯の里店で働いてみたい方は、以下のリンクから詳細を確認のうえ、エントリーをお願いします。
            </p>
          </div>
          <ul className="text-gray-800 w-[100%] flex flex-col md:flex-row sm:flex-wrap gap-4 mt-12 lg:mt-0 items-center">
            <li className="w-[70%] sm:w-[50%] md:w-[45%] xl:w-[40%]">
              <Link href="/">
                <RecruitButton item="募集時間枠" />
              </Link>
            </li>
            <li className="w-[70%] sm:w-[50%] md:w-[45%] xl:w-[40%]">
              <Link href="/">
                <RecruitButton item="店長・社員採用" />
              </Link>
            </li>
            <li className="w-[70%] sm:w-[50%] md:w-[45%] xl:w-[40%]">
              <Link href="/">
                <RecruitButton item="パート・アルバイト採用" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Recruitment;
