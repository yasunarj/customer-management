"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/images/hero2.jpg",
  "/images/20200127130542.jpg",
  "/images/18.png",
  "/images/photo-1735303937312-381ad640f71e.avif",
];

const Hero = () => {
  const [index, setIndex] = useState<number>(0);
  const [isVisibleImage, setIsVisibleImage] = useState<boolean>(false);
  const [isVisibleTitle, setIsVisibleTitle] = useState<boolean>(false);

  useEffect(() => {
    const timeoutImage = setTimeout(() => {
      setIsVisibleImage(true);
    }, 100);

    const timeoutTitle = setTimeout(() => {
      setIsVisibleTitle(true);
    }, 600);

    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => {
      clearTimeout(timeoutImage);
      clearTimeout(timeoutTitle);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden transition-opacity duration-1000 h-[calc(100svh-var(--lp-header-h))] 
    supports-[height:100dvh]:h-[calc(100dvh-var(--lp-header-h))] ${
      isVisibleImage ? "opacity-100" : "opacity-0"
    }`}
    >
      {images.map((src, i) => (
        <Image
          key={i}
          src={src}
          fill
          priority={i === 0}
          alt="hero画像"
          className={`absolute inset-0 object-cover transition-opacity duration-1000 ${
            index === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <h1
        className={`absolute bottom-4 left-4 sm:bottom-8 sm:left-8 md:bottom-12 md:left-12 text-white transition-all duration-1000 ${
          isVisibleTitle
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        <span className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
          明日の未来を、
          <br />
          共に作る。
        </span>
        <p className="font-playfairDisplay font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mt-4">
          Building Tomorrow&apos; Future Together
        </p>
      </h1>
    </div>
  );
};

export default Hero;
