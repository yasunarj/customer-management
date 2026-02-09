"use client";
import { useEffect } from "react";

export default function ViewportVar() {
  useEffect(() => {
    const set = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--vvh", `${h}px`);
    };

    set();

    // iOS Safari 対策：スクロールでバー高さが変わるのを拾う
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
