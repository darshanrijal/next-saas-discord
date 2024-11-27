import React, { Suspense } from "react";
import { Navbar } from "@/components/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<></>}>
        <Navbar />
      </Suspense>
      {children}
    </>
  );
}
