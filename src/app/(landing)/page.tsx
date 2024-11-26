import { DiscordMessage } from "@/components/DiscordMessage";
import { Heading } from "@/components/Heading";
import { Icons } from "@/components/icons";
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { MockDiscordUI } from "@/components/MockDiscordUI";
import { ShinyButton } from "@/components/ShinyButton";
import { AnimatedList } from "@/components/ui/animated-list";
import { CheckIcon, Star } from "lucide-react";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Page() {
  const codeSnippet = `await fetch("http://localhost:3000/api/v1/events", {
  method: "POST",
  body: JSON.stringify({
    category: "sale",
    fields: {
      plan: "PRO",
      email: "darshanrijal0@gmail.com",
      amount: 5000.00
    }
  }),
  headers: {
    Authorization: "Bearer <YOUR_API_KEY>"
  }
})`;
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

      <section className="relative bg-brand-25 pb-4">
        <div className="absolute inset-x-0 inset-y-24 bg-brand-700" />

        <div className="relative mx-auto">
          <MaxWidthWrapper className="relative">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <MockDiscordUI>
                <AnimatedList className="flex flex-col-reverse">
                  <DiscordMessage
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="PingPanda Avatar"
                    username="PingPanda"
                    timestamp="Today at 12:35PM"
                    badgeText="SignUp"
                    badgeColor="#43b581"
                    title="👤 New user signed up"
                    content={{
                      name: "Darshan Rijal",
                      email: "darshanrijal0@gmail.com",
                    }}
                  />
                  <DiscordMessage
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="PingPanda Avatar"
                    username="PingPanda"
                    timestamp="Today at 12:35PM"
                    badgeText="Revenue"
                    badgeColor="#faa61a"
                    title="💰 Payment received"
                    content={{
                      amount: "NPR 5000",
                      email: "darshanrijal0@gmail.com",
                      plan: "PRO",
                    }}
                  />
                  <DiscordMessage
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="PingPanda Avatar"
                    username="PingPanda"
                    timestamp="Today at 5:11AM"
                    badgeText="Milestone"
                    badgeColor="#5865f2"
                    title="🚀 Revenue Milestone Achieved"
                    content={{
                      recurringRevenue: "NPR 150000",
                      growth: "+8.2%",
                    }}
                  />
                </AnimatedList>
              </MockDiscordUI>
            </div>
          </MaxWidthWrapper>
        </div>
      </section>

      <section className="relative bg-brand-25 py-24 sm:py-32">
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-20">
          <div>
            <h2 className="text-center text-base/7 font-semibold text-brand-600">
              Intuative Monitoring
            </h2>
            <Heading className="text-pretty text-center">
              Stay ahead with Real-Time insights
            </Heading>
          </div>

          <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
            {/* First bento grid element */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]" />

              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                  <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                    Real time notifications
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Get notified about critical event the moment they happen, no
                    matter if you're at home or on the go.
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                  <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                    <Image
                      className="size-full object-cover object-top"
                      src="/phone-screen.png"
                      alt="phone screen displaying app interface"
                      fill
                    />
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]" />
            </div>

            {/* Second bento grid element */}
            <div className="relative max-lg:row-start-1">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]" />

              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                    Track Any Event
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    From new user signups to successful payments, PingPanda
                    notifies you for all critical event in your SaaS.
                  </p>
                </div>

                <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                  <Image
                    className="w-full max-lg:max-w-xs"
                    src="/bento-any-event.png"
                    alt="bento box illustating event tracking"
                    width={500}
                    height={300}
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]" />
            </div>

            {/* Third bento grid element */}
            <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
              <div className="absolute inset-px rounded-lg bg-white">
                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                  <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                    <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                      Track any properties
                    </p>
                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                      Add any custom data you like to an event such as a user
                      email, a purchase amount or an unexpected quota.
                    </p>
                  </div>
                  <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                    <Image
                      className="w-full max-lg:max-w-xs"
                      src="/bento-custom-data.png"
                      alt="bento box illustating custom data tracking"
                      width={500}
                      height={300}
                    />
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5" />
            </div>

            {/* Fourth bento grid element */}
            <div className="relative row-span-2">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />

              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[2rem+1px] lg:rounded-r-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                  <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                    Easy integration
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Connect PingPanda with your existing workflows in minute and
                    call our intuative logging API in minutes.
                  </p>
                </div>

                <div className="relative min-h-[30rem] w-full grow">
                  <div className="absolute bottom-0 left-10 right-0 top-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                    <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                      <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                        <div className="border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                          pingpanda.js
                        </div>
                      </div>
                    </div>

                    <div className="overflow-hidden">
                      <div className="max-h-[30rem]">
                        <SyntaxHighlighter
                          language="typescript"
                          style={{
                            ...oneDark,
                            'pre[class*="language-"]': {
                              ...oneDark['pre[class*="language-"]'],
                              background: "transparent",
                              overflow: "hidden",
                            },
                            'code[class*="language-"]': {
                              ...oneDark['code[class*="language-"]'],
                              background: "transparent",
                            },
                          }}
                        >
                          {codeSnippet}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      <section className="relative bg-white py-24 sm:py-32">
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-20">
          <div>
            <h2 className="text-center text-base/7 font-semibold text-brand-600">
              Real world experiences
            </h2>
            <Heading className="text-center">What our customers say</Heading>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 divide-y divide-gray-200 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {/* First customer review */}
            <div className="flex flex-auto flex-col gap-4 rounded-t-[2rem] bg-brand-25 p-6 sm:p-8 lg:rounded-l-[2rem] lg:rounded-tr-none lg:p-16">
              <div className="mb-2 flex justify-center gap-0.5 lg:justify-start">
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
              </div>

              <p className="text-pretty text-center text-base font-medium tracking-tight text-brand-950 sm:text-lg lg:text-left lg:text-lg/8">
                PingPanda has been a gamechanger for me. I've been using it for
                2 months now and seeing sales pop up in real-time is super
                satisfying
              </p>

              <div className="mt-2 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start lg:justify-start">
                <Image
                  src="/user-2.png"
                  className="rounded-full object-cover"
                  alt="Aayuuuuuu"
                  width={48}
                  height={48}
                />
                <div className="flex flex-col items-center sm:items-start">
                  <p className="flex items-center font-semibold">
                    Aayusha Pokhrel
                    <Icons.verificationBadge className="ml-1.5 inline-block size-4" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    @aayushapokhrel0
                  </p>
                </div>
              </div>
            </div>
            {/* Second customer review */}
            <div className="flex flex-auto flex-col gap-4 rounded-b-[2rem] bg-brand-25 p-6 sm:p-8 lg:rounded-r-[2rem] lg:rounded-bl-none lg:p-16">
              <div className="mb-2 flex justify-center gap-0.5 lg:justify-start">
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
              </div>

              <p className="text-pretty text-center text-base font-medium tracking-tight text-brand-950 sm:text-lg lg:text-left lg:text-lg/8">
                J aayusha le bhanchey tyei.
              </p>

              <div className="mt-2 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start lg:justify-start">
                <Image
                  src="/user-1.png"
                  className="rounded-full object-cover"
                  alt="rijal"
                  width={48}
                  height={48}
                />
                <div className="flex flex-col items-center sm:items-start">
                  <p className="flex items-center font-semibold">
                    Darshan Rijal
                    <Icons.verificationBadge className="ml-1.5 inline-block size-4" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    @darshanrijal0
                  </p>
                </div>
              </div>
            </div>
          </div>
          <ShinyButton
            href="/sign-up"
            className="relative z-10 h-14 w-full max-w-xs text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
          >
            Start for free today
          </ShinyButton>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
