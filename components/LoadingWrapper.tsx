"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [done, setDone] = useState(isAdmin);

  // If the user navigates into /admin later, ensure it stays unblocked
  useEffect(() => {
    if (isAdmin) setDone(true);
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

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
