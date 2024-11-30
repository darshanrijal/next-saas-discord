"use client";
import { Card } from "@/components/Card";
import { api } from "@/lib/api";
import { Plan } from "@/lib/db/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BarChart } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import SuperJSON from "superjson";
import { FREE_QUOTA } from "@/constants";
import { format } from "date-fns";

export const UpgradePageContent = ({ plan }: { plan: Plan }) => {
  const router = useRouter();

  const { mutate: createCheckoutSession } = useMutation({
    mutationFn: async () => {
      const res = await api.payments["create-checkout-session"].$post();
      const data = await res.json();
      return data;
    },
    onSuccess({ url }) {
      if (url) {
        router.push(url);
      }
    },
  });

  const { data: usageData } = useQuery({
    queryKey: ["usage"],
    queryFn: async () => {
      const res = await api.project["get-usage"].$get();
      const json = await res.json();
      const data = SuperJSON.deserialize(json) satisfies ProjectGetUsage;
      return data;
    },
  });
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div>
        <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
          {plan === "PRO" ? "Plan: Pro" : "Plan: Free"}
        </h1>

        <p className="max-w-prose text-sm/6 text-gray-600">
          {plan === "PRO"
            ? "Thank you for supporting PingPanda. Find your increases usuage limites below"
            : "Get access to more events, categories and premium support."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-2 border-brand-700">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">Total Events</p>
            <BarChart className="size-4 text-muted-foreground" />
          </div>

          <div>
            <p className="text-2xl font-bold">
              {usageData?.eventsUsed || 0} of{" "}
              {usageData?.eventsLimit.toLocaleString() ||
                FREE_QUOTA.maxEventsPerMonth}
            </p>
            <p className="text-xs/5 text-muted-foreground">
              Events this period
            </p>
          </div>
        </Card>
        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">Event categories</p>
            <BarChart className="size-4 text-muted-foreground" />
          </div>

          <div>
            <p className="text-2xl font-bold">
              {usageData?.categoriesUsed || 0} of{" "}
              {usageData?.categoriesLimit.toLocaleString() ||
                FREE_QUOTA.maxEventsCategorires}
            </p>
            <p className="text-xs/5 text-muted-foreground">Active categories</p>
          </div>
        </Card>
      </div>

      <p className="text-sm text-gray-500">
        Usage will reset{" "}
        {usageData?.resetDate ? (
          format(usageData.resetDate, "MMM d, yyyy")
        ) : (
          <span className="h-4 w-8 animate-pulse bg-gray-200"></span>
        )}{" "}
        {plan !== "PRO" ? (
          <span
            onClick={() => createCheckoutSession()}
            className="inline cursor-pointer text-brand-600 underline"
          >
            or upgrade now to increase your limit &rarr;
          </span>
        ) : null}
      </p>
    </div>
  );
};
