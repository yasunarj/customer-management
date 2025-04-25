"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const ClientPathChecker = () => {
  const pathname = usePathname();
  const [ isLP, setIsLP ] = useState<boolean | null>(null);

  useEffect(() => {
    const isLandingPage = pathname.startsWith("/lp");
    setIsLP(isLandingPage);

    const header = document.querySelector(".main-header");
    const footer = document.querySelector(".main-footer");

    if(isLP) {
      header?.classList.add("lp-mode");
      footer?.classList.add("lp-mode");
    } else {
      header?.classList.remove("lp-mode");
      footer?.classList.remove("lp-mode");
    }
  }, [isLP,pathname]);

  return null;
};

export default ClientPathChecker;