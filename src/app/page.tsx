import { Heading } from "@/components/Heading";
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { ShinyButton } from "@/components/ShinyButton";
import { CheckIcon } from "lucide-react";

export default function Page() {
  return (
    <>
      <section className="relative bg-brand-25 py-24 sm:py-32">
        <MaxWidthWrapper className="text-center">
          <div className="relative mx-auto flex flex-col items-center gap-10 text-center">
            <div>
              <Heading>
                <span>Real-Time SaaS Insights,</span>
                <br />
                <span className="relative bg-gradient-to-r from-brand-700 to-brand-800 bg-clip-text text-transparent">
                  Delivered to Your Discord
                </span>
              </Heading>
            </div>

            <p className="max-w-prose text-pretty text-center text-base/7 text-gray-600">
              PingPanda is the easiest way to monitor your SaaS. Get instant
              notifications for{" "}
              <span className="font-semibold text-gray-700">
                Sales, new users or any other event{" "}
              </span>
              sent directly to your Discord
            </p>

            <ul className="flex flex-col items-start space-y-2 text-left text-base/7 text-gray-600">
              {[
                "Real-time Discord alerts for critical events",
                "Buy once use forever",
                "Track sales, new users or any other event",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-1.5 text-left">
                  <CheckIcon className="size-5 shrink-0 text-brand-700" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="w-full max-w-80">
              <ShinyButton
                href="/sign-up"
                className="relative z-10 h-14 w-full shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                Start for free today
              </ShinyButton>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
      <section></section>
      <section></section>
      <section></section>
    </>
  );
}
