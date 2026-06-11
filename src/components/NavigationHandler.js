'use client';

import { usePathname } from "next/navigation";
import AppNav from "@/components/public/BottomNav";
import Footer from "@/components/public/Footer";

export default function NavigationHandler({ children }) {
  const pathname = usePathname();
  // Check if the current path starts with /admin
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <AppNav />}
      <main className={` flex-1  ${!isAdminRoute && "-mt-20"}`}>{children}</main>
      {!isAdminRoute && <Footer />}
    </>
  );
}