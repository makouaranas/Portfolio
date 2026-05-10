"use client";

import { useState } from "react";
import LoadingScreen from "./LoadingScreen";

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);

  return (
    <>
      {!done && <LoadingScreen onDone={() => setDone(true)} />}
      <div
        style={{
          opacity: done ? 1 : 0,
          transition: "opacity 0.6s ease 0.15s",
        }}
      >
        {children}
      </div>
    </>
  );
}
