"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

export function NavbarWrapper() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (isAuthPage) {
    return null;
  }

  return (
    <>
      <div className="pt-20" />
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
    </>
  );
} 