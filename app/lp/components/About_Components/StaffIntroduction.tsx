import { useRef, useEffect, useState, useCallback } from "react";
import { staffList } from "../../lib/staffList";
import StaffCard from "./StaffCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StaffIntroduction = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const indexRef = useRef(0);

  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [isUp, setIsUp] = useState<boolean>(true);
  const [isSlide, setIsSlide] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCardWidth = useCallback(
    () => (windowWidth >= 768 ? 300 : 240),
    [windowWidth]
  );

  const stopAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleSlide = useCallback(
    (slideCount: number) => {
      if (!isSlide && sliderRef.current) {
        setIsSlide(true);
        stopAutoSlide();
        setIsUp((prev) => !prev);
        const slider = sliderRef.current;
        const cardWidth = getCardWidth();
        indexRef.current += slideCount;

        if (indexRef.current < 0) {
          const jumpTo = staffList.length * 2;

          slider.style.transition = "none";
          indexRef.current = jumpTo;
          slider.style.transform = `translateX(-${
            jumpTo * cardWidth + 16 * jumpTo
          }px)`;

          void slider.offsetHeight;

          requestAnimationFrame(() => {
            indexRef.current = jumpTo - 1;
            slider.style.transition = "transform 1s ease-in-out";
            slider.style.transform = `translateX(-${
              indexRef.current * cardWidth + 16 * indexRef.current
            }px)`;
          });
          setTimeout(() => {
            setIsSlide(false);
          }, 1000);
          return;
        } else if (indexRef.current >= staffList.length * 2) {
          slider.style.transition = "transform 1s ease-in-out";
          slider.style.transform = `translateX(-${
            indexRef.current * cardWidth + 16 * indexRef.current
          }px)`;

          setTimeout(() => {
            slider.style.transition = "none";
            slider.style.transform = "translateX(0%)";
            indexRef.current = 0;
          }, 1000);
        }
        slider.style.transition = "transform 1s ease-in-out";
        slider.style.transform = `translateX(-${
          indexRef.current * cardWidth + 16 * indexRef.current
        }px)`;
        setTimeout(() => {
          setIsSlide(false);
        }, 1000);
      }
    },
    [getCardWidth, isSlide, stopAutoSlide]
  );

  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      handleSlide(1);
    }, 3000);
  }, [handleSlide]);

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [startAutoSlide, stopAutoSlide]);

  return (
    <div id="staff" className="scroll-mt-20 overflow-hidden pt-28 md:pt-52 -mr-4 md:-mr-8">
      <h2 className="text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold pl-4">
        スタッフ紹介
      </h2>
      <p className="pl-4 mt-8 text-sm md:text-[16px] lg:text-lg sm:px-4 font-semibold text-white leading-relaxed">
        セブンイレブンさくら卯の里店では、経験や年齢、国籍など問わずに色々な方が働いています。
      </p>
      <p className="pl-4 mt-2 text-sm md:text-[16px] lg:text-lg xl:text-xl sm:px-4 font-semibold text-white leading-relaxed">
        それぞれのメンバーがどのように働いているかコメントを交えてご紹介します。
      </p>
      <div className="hidden sm:flex gap-3 lg:gap-4 justify-end my-4 mr-4 md:mr-8">
        <ChevronLeft
          className="bg-white rounded-full w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 p-2 md:p-3 lg:p-4"
          onClick={() => handleSlide(-1)}
        />
        <ChevronRight
          className="bg-white rounded-full  w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 p-2 md:p-3 lg:p-4"
          onClick={() => handleSlide(1)}
        />
      </div>
      <div
        ref={sliderRef}
        className="flex transition-transform duration-1000 ease-in-out w-[calc(240px * 10)] mt-12 ml-2"
      >
        {[...staffList, ...staffList, ...staffList].map((staff, idx) => {
          const offsetUp = (idx % 2 === 0 && isUp) || (idx % 2 !== 0 && !isUp);
          return <StaffCard key={idx} {...staff} offsetUp={offsetUp} />;
        })}
      </div>
      <div className="flex justify-center mt-8">
        <Link href="/">
          <button className="group relative font-bold bg-white rounded-full w-48 py-3 hover:white hover:no-underline">
            <span className="text-[16px]">スタッフ一覧</span>
            <div className="absolute top-3 right-3 w-[16px] overflow-hidden">
              <span className="flex transition-transform duration-300 ease-in-out transform group-hover:-translate-x-4">
                <span>➡︎</span>
                <span>➡︎</span>
              </span>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StaffIntroduction;

// const sliderRef = useRef<HTMLDivElement | null>(null);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);
//   const indexRef = useRef(0);

//   const [windowWidth, setWindowWidth] = useState<number>(
//     typeof window !== "undefined" ? window.innerWidth : 0
//   );
//   const [isUp, setIsUp] = useState<boolean>(true);
//   const [isSlide, setIsSlide] = useState<boolean>(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const getCardWidth = useCallback(
//     () => (windowWidth >= 768 ? 300 : 240),
//     [windowWidth]
//   );

//   const stopAutoSlide = useCallback(() => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//   }, []);

//   const handleSlide = useCallback(
//     (slideCount: number) => {
//       if (!isSlide && sliderRef.current) {
//         setIsSlide(true);
//         stopAutoSlide();
//         setIsUp((prev) => !prev);
//         const slider = sliderRef.current;
//         const cardWidth = getCardWidth();
//         indexRef.current += slideCount;

//         const minIndex = 0;
//         if (indexRef.current < minIndex) {
//           indexRef.current = 0;
//         } else if (indexRef.current >= staffList.length * 2) {
//           slider.style.transition = "transform 1s ease-in-out";
//           slider.style.transform = `translateX(-${
//             indexRef.current * cardWidth + 16 * indexRef.current
//           }px)`;

//           setTimeout(() => {
//             slider.style.transition = "none";
//             slider.style.transform = "translateX(0%)";
//             indexRef.current = 0;
//           }, 1000);
//         }

//         slider.style.transition = "transform 1s ease-in-out";
//         slider.style.transform = `translateX(-${
//           indexRef.current * cardWidth + 16 * indexRef.current
//         }px)`;
//         setTimeout(() => {
//           setIsSlide(false);
//         }, 1000);
//       }
//     },
//     [getCardWidth, isSlide, stopAutoSlide]
//   );

//   const startAutoSlide = useCallback(() => {
//     if (intervalRef.current) clearInterval(intervalRef.current);
//     intervalRef.current = setInterval(() => {
//       handleSlide(1);
//     }, 3000);
//   }, [handleSlide]);

//   useEffect(() => {
//     startAutoSlide();
//     return () => stopAutoSlide();
//   }, [startAutoSlide, stopAutoSlide]);
