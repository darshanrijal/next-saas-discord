import React, { Suspense } from "react";
import { Navbar } from "@/components/Navbar";

export default function LandingLayout({
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
