"use client";

import { ReactNode } from "react";
import { useViewportHeight } from "../hooks/useViewportHeight";

const ClientWrapper = ({children}: {children: ReactNode}) => {
  useViewportHeight();

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(var(--vh, 1vh) * 100)"}}>
      {children}
    </div>
  )
}

export default ClientWrapper;