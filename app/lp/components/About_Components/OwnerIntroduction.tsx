import { useFadeInOnView } from "@/hooks/useFadeInOnView";
import Image from "next/image";

const OwnerIntroduction = () => {
  const owner = useFadeInOnView();
  const ownerImage = useFadeInOnView(0.8);
  const ownerComment = useFadeInOnView();

  return (
    <div className="sm:flex sm:flex-col sm:items-end">
      <div className="sm:max-w-[540px] md:max-w-[620px] xl:max-w-[820px] mt-28 flex pl-4 sm:px-4 md:px-0 gap-8 sm:gap-32 md:gap-52 lg:gap-32 xl:gap-60 sm:justify-end">
        <div
          ref={owner.ref}
          className={`sm:w-[40%] md:w-[30%] lg:w-[40%] space-y-2 transition-all duration-1000 transform ${
            owner.isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-8 opacity-0"
          }`}
        >
          <h2 className="text-lg sm:text-xl lg:text-3xl font-semibold text-white">
            代表者 (オーナー)
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-end sm:pl-20 font-semibold text-white">
            高橋靖也
          </p>
        </div>
        <div
          ref={ownerImage.ref}
          className={`relative top-0 right-0 w-[160px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[260px] md:h-[260px] xl:w-[320px] xl:h-[320px]  transition-all duration-1000 transform ${
            ownerImage.isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-8 opacity-0"
          }`}
        >
          <Image
            src="/images/unnamed.jpg"
            alt="オーナー画像"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
      <div
        ref={ownerComment.ref}
        className={`mt-8 sm:mt-0 sm:max-w-[540px] md:max-w-[640px] xl:max-w-[820px] flex justify-end transition-all duration-1000 transform ${
          ownerComment.isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
      >
        <p className="text-white text-sm md:text-[16px] sm:mt-8 pl-4 sm:pl-4 leading-relaxed">
          さくら卯の里店は、おかげさまでオープン11年目を迎えました。
          <br />
          私たちは常にお客様の立場にたち、ご要望にお応えできるように努めてまいりました。
          <br />
          これからも社会変化の対応するだけでなく、より良い商品やサービスを提供し、お客様に感動していただけるようなお店づくりを目指してまいります。
        </p>
      </div>
    </div>
  );
};

export default OwnerIntroduction;
