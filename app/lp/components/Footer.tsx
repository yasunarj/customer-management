import Image from "next/image";
import Link from "next/link";
const LandingPageFooter = () => {
  return (
    <footer className="w-full h-84 2xl:h-68" style={{ backgroundColor: "#282828" }}>
      <div className="pt-2 sm:pt-4 2xl:pb-4 border-b border-b-white">
        <div className="wrapper font-oswald 2xl:h-[76px]">
          <p className="loop text-4xl sm:text-5xl 2xl:text-6xl tracking-widest sm:w-[330%] md:w-[280%] lg:w-[210%] xl:w-[170%] 2xl:w-[180%] italic">
            Creating Tomorrow&apos;s Smiles Together! Enrich customers&apos;
            lives through products and services.
          </p>
          <p className="loop loop2 text-4xl sm:text-5xl 2xl:text-6xl tracking-widest sm:w-[330%] md:w-[280%] lg:w-[210%] xl:w-[170%] 2xl:w-[180%] italic">
            Creating Tomorrow&apos;s Smiles Together! Enrich customers&apos;
            lives through products and services.
          </p>
        </div>
      </div>

      <div className="px-4 lg:px-8 pt-4 flex flex-col justify-between h-60 2xl:h-48">
        <div className="flex justify-between">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-16">
            <div className="flex gap-2 items-end lg:items-start">
              <Image
                src={"/images/logo_food.png"}
                alt="LPのheaderロゴ"
                width={32}
                height={32}
                className="mb-1 2xl:hidden"
              />
              <Image
                src={"/images/logo_food.png"}
                alt="LPのheaderロゴ"
                width={44}
                height={44}
                className="hidden mb-1 2xl:block"
              />
              <div>
                <h3 className="text-white lg:text-lg 2xl:text-2xl font-semibold font-ibmPlexSansJP lg:mt-2 2xl:mt-4">
                  さくら卯の里４丁目店
                </h3>
              </div>
            </div>
            <div>
              <p className="text-gray-300 font-playfairDisplay 2xl:text-xl">
                Creating Tomorrow&apos;s
              </p>
              <p className="text-gray-300 font-playfairDisplay 2xl:text-xl">Smiles Together</p>
            </div>
          </div>
          <ul className="flex flex-col xl:flex-row gap-3 xl:gap-12 text-gray-300 font-ibmPlexSansJP 2xl:text-lg mt-2">
            <div className="flex flex-col 2xl:flex-row gap-3 2xl:gap-12 items-end xl:items-start">
              <li className="hover:text-gray-200 text-sm sm:text-[16px] 2xl:text-lg">
                <Link href="/">さくら卯の里店を知る</Link>
              </li>
              <li className="hover:text-gray-200 text-sm sm:text-[16px] 2xl:text-lg">
                <Link href="/">採用情報を知る</Link>
              </li>
            </div>
            <div className="flex flex-col 2xl:flex-row gap-3 2xl:gap-12 items-end xl:items-start">
              <li className="hover:text-gray-200 text-sm sm:text-[16px] 2xl:text-lg">
                <Link href="/">働く人を知る</Link>
              </li>
              <li className="hover:text-gray-200 text-sm sm:text-[16px] 2xl:text-lg">
                <Link href="/">FAQ</Link>
              </li>
            </div>
          </ul>
        </div>

        <div className="text-white">
          <footer className="text-sm 2xl:text-lg font-semibold font-playfairDisplay mb-2">
            &copy; 2025 Nari&apos;s Company
          </footer>
        </div>
      </div>
    </footer>
  );
};

export default LandingPageFooter;
{
  /* <span className="">
              Creating Tomorrow&apos;s Smiles Together! Enrich customers&apos;
              lives through products and services.
            </span> */
}
