"use client";
import { useLayoutEffect } from "react";

export default function ViewportVar() {
  useLayoutEffect(() => {
    const set = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--vvh", `${Math.floor(h)}px`);
    };

    set();
    window.visualViewport?.addEventListener("resize", set);
    window.visualViewport?.addEventListener("scroll", set);
    window.addEventListener("resize", set);

    return () => {
      window.visualViewport?.removeEventListener("resize", set);
      window.visualViewport?.removeEventListener("scroll", set);
      window.removeEventListener("resize", set);
    };
  }, []);

  return null;
}

