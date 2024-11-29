"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Heading } from "./Heading";
import { useRouter } from "next/navigation";

interface DashboardPageProps {
  title: string;
  children?: React.ReactNode;
  hideBackButton?: boolean;
  cta?: React.ReactNode;
}

export const DashboardPage = ({
  title,
  children,
  cta,
  hideBackButton,
}: DashboardPageProps) => {
  const router = useRouter();
  return (
    <section className="flex h-full w-full flex-1 flex-col">
      <div className="flex w-full justify-between border-b border-gray-200 p-6 sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="flex w-full items-center gap-8">
            {!hideBackButton && (
              <Button
                className="w-fit bg-white"
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="size-4" />
              </Button>
            )}
            <Heading>{title}</Heading>
          </div>

          {cta ? <div>{cta}</div> : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:p-8">
        {children}
      </div>
    </section>
  );
};
