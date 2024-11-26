import { cn } from "@/lib/utils";
import React from "react";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const Heading = ({ children, className, ...props }: HeadingProps) => {
  return (
    <h1
      className={cn(
        "text-pretty text-4xl font-semibold tracking-tight text-zinc-800 sm:text-5xl",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
};
