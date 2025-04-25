"use client";
import { useFadeInOnView } from "@/hooks/useFadeInOnView";
import Image from "next/image";

const AboutTitle = () => {

  const title = useFadeInOnView();
  const titleImage = useFadeInOnView();

  return (
    <div
      id="about"
      className={`scroll-mt-20 max-w-[1500px] h-[400px] mx-auto mt-12 sm:mt-28 md:mt-36 lg:mt-44 xl:mt-52 pb-24 sm:pb-32 md:pb-40 lg:pb-48 xl:pb-56 `}
    >
      <div ref={title.ref} className={`relative transition-all duration-1000 transform ease-in-out ${
        title.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}>
        <h2 className={`text-center text-gray-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-playfairDisplay italic underline underline-offset-4 decoration-orange-400 decoration-[2px]`}>
          About us
        </h2>
        <p className="text-center text-gray-900 text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-2 sm:mt-4 md:mt-6 lg:mt-8 xl:mt-10">
          さくら卯の里４丁目店について
        </p>
      </div>
      <div ref={titleImage.ref} className={`relative mt-8 transition-all duration-1000 transform ease-in-out ${titleImage.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
        <div className="absolute top-0 left-0 w-full h-[240px] sm:h-[320px] md:h-[420px]">
          <Image
            src="/images/00000000000000096478_0000013438_1.jpg"
            alt="さくら卯の里４丁目店舗画像"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutTitle;
