"use client";
import { useFadeInOnView } from "@/hooks/useFadeInOnView";
import Image from "next/image";

const Philosophy = () => {
  const philosophyTitle = useFadeInOnView();
  const philosophyImage1 = useFadeInOnView();
  const philosophyImage2 = useFadeInOnView(0.5);
  const philosophyImage3 = useFadeInOnView(0.4);

  const philosophyImageMobile1 = useFadeInOnView(0.5);
  const philosophyImageMobile2 = useFadeInOnView(0.5);
  const philosophyImageMobile3 = useFadeInOnView(0.5);
  const philosophyImageMobile4 = useFadeInOnView(0.5);
  const philosophyImageMobile5 = useFadeInOnView(0.5);

  return (
    <div>
      <div
        className={`relative max-w-[1500px] mx-auto px-4 mt-24 sm:mt-32 md:mt-40 lg:mt-48 xl:mt-56 pb-24 sm:pb-32 md:pb-40 lg:pb-48 xl:pb-56 h-auto`}
      >
        <div
          ref={philosophyTitle.ref}
          className={`transition-all duration-1000 transform ease-in-out ${
            philosophyTitle.isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="text-center text-gray-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-playfairDisplay italic underline underline-offset-4 decoration-green-500 decoration-[2px]">
            Shop Philosophy
          </h2>
          <p className="text-center text-gray-900 text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-2 sm:mt-4 md:mt-6 lg:mt-8 xl:mt-10">
            地域に寄り添う、あたたかいサービスを。
          </p>
        </div>
        <div className="space-y-8 sm:space-y-16 md:space-y-24 text-center mt-16 sm:mt-24 md:mt-32 lg:mt-40 xl:mt-48 sm:text-xl md:text-2xl lg:text-3xl xl:text:4xl">
          <p style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}>
            ありがとう。
          </p>
          <div
            className="space-y-2 sm:space-y-4 md:space-y-6 lg:space-y-8"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
          >
            <p>その言葉をいただき続けて</p>
            <p>もう10年が経ちました。</p>
          </div>
          <div
            className="space-y-2 sm:space-y-4 md:space-y-6 lg:space-y-8"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
          >
            <p>商品やサービスを通じて、</p>
            <p>お客様の暮らしを少しでも豊かに。</p>
          </div>
          <div
            className="space-y-2 sm:space-y-4 md:space-y-6 lg:space-y-8"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
          >
            <p>これからもお客様の笑顔を大切に、</p>
            <p>寄り添い続けられる</p>
            <p>お店を目指しまいります</p>
          </div>
          <div
            ref={philosophyImage1.ref}
            className={`sm:w-[240px] sm:h-[240px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] xl:w-[500px] xl:h-[500px] absolute top-20 right-5 lg:right-10 transition-all ease-in-out ${
              philosophyImage1.isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: "3000ms" }}
          >
            <Image
              src="/images/1_ph01.jpg"
              alt="philosophy画像1"
              fill
              className="object-cover rounded-full opacity-50"
            />
          </div>
          <div
            ref={philosophyImage2.ref}
            className={`sm:w-[280px] sm:h-[280px] md:w-[360px] lg:w-[420px] md:h-[360px] lg:h-[420px] xl:w-[540px] xl:h-[540px] absolute top-48 md:top-64 md:left-5 lg:left-10 transition-all ease-in-out ${
              philosophyImage2.isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: "3000ms" }}
          >
            <Image
              src="/images/img_8614fdc8c874e9880665fc9a54e630cd17958.jpg"
              alt="philosophy画像2"
              fill
              className="object-cover rounded-full opacity-50"
            />
          </div>
          <div
            ref={philosophyImage3.ref}
            className={`sm:w-[180px] sm:h-[180px] md:w-[260px] lg:w-[330px] md:h-[260px] lg:h-[330px] xl:w-[450px] xl:h-[450px] absolute bottom-20 md:bottom-28 xl:bottom-14 right-16 md:right-20 transition-all ease-in-out ${
              philosophyImage3.isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: "3000ms" }}
          >
            <Image
              src="/images/133_02_08.png"
              alt="philosophy画像3"
              fill
              className="object-cover rounded-full opacity-50"
            />
          </div>
        </div>
        <div
          className={`relative sm:hidden opacity-70 mt-16 w-full h-[150px] overflow-hidden`}
          style={{ transitionDuration: "3000ms" }}
        >
          <div
            ref={philosophyImageMobile1.ref}
            className={`absolute top-6 -left-2 w-[140px] h-[120px] -rotate-6 z-50 transition-all ease-in-out ${
              philosophyImageMobile2.isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: "1000ms" }}
          >
            <Image
              src="/images/img_8614fdc8c874e9880665fc9a54e630cd17958.jpg"
              alt="philosophy画像1"
              fill
              className="object-cover"
            />
          </div>
          <div
            ref={philosophyImageMobile2.ref}
            className={`absolute -top-2 left-28 w-[140px] h-[120px] rotate-6 z-40 transition-all ease-in-out ${
              philosophyImageMobile2.isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: "2000ms" }}
          >
            <Image
              src="/images/1_ph01.jpg"
              alt="philosophy画像2"
              fill
              className="object-cover"
            />
          </div>
          <div
            ref={philosophyImageMobile3.ref}
            className={`absolute top-6 left-60 w-[120px] h-[120px] rotate-3 z-30 transition-all ease-in-out ${
              philosophyImageMobile3.isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: "3000ms" }}
          >
            <Image
              src="/images/133_02_08.png"
              alt="philosophy画像3"
              fill
              className="object-cover"
            />
          </div>
          <div
            ref={philosophyImageMobile4.ref}
            className={`absolute -top-2 left-[360px] w-[140px] h-[120px] -rotate-6 z-20 transition-all ease-in-out ${
              philosophyImageMobile4.isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: "4000ms" }}
          >
            <Image
              src="/images/137_02_04.png"
              alt="philosophy画像2"
              fill
              className="object-cover"
            />
          </div>
          <div
            ref={philosophyImageMobile5.ref}
            className={`absolute top-6 left-[480px] w-[140px] h-[120px] rotate-6 z-10 transition-all ease-in-out ${
              philosophyImageMobile5.isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: "5000ms" }}
          >
            <Image
              src="/images/20200127130542.jpg"
              alt="philosophy画像1"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Philosophy;
