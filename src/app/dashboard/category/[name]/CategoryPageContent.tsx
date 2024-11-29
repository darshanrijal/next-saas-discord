"use client";

import { Card } from "@/components/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { Event, EventCategoryWithEvents } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";
import { isAfter, isToday, startOfMonth, startOfWeek } from "date-fns";
import { ArrowUpDown, BarChartIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { EmptyCategoryState } from "./EmptyCategoryState";
import { ColumnDef, Row, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryPageContentProps {
  hasEvents: boolean;
  category: EventCategoryWithEvents;
}

export const CategoryPageContent = ({
  hasEvents: initialHasEvents,
  category,
}: CategoryPageContentProps) => {
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "30", 10);

  const [pagination, _] = useState({
    pageIndex: page - 1,
    pageSize: limit,
  });

  const [activeTab, setActiveTab] = useState<"today" | "week" | "month">(
    "today",
  );

  const { data: pollingData } = useQuery<{ hasEvents: boolean }>({
    queryKey: ["category", category.name, "hasEvents"],
    initialData: { hasEvents: initialHasEvents },
  });

  if (!pollingData.hasEvents) {
    return <EmptyCategoryState categoryName={category.name} />;
  }

  const { data } = useQuery({
    queryKey: [
      "events",
      category.name,
      pagination.pageIndex,
      pagination.pageSize,
      activeTab,
    ],
    queryFn: async () => {
      const res = await api.categories["get-event-by-category-name"].$get({
        query: {
          name: category.name,
          timeRange: activeTab,
          limit: pagination.pageSize.toString(),
          page: (pagination.pageIndex + 1).toString(),
        },
      });

      const data = await res.json();
      return data;
    },
    enabled: pollingData.hasEvents,
  });

  const coloumns: ColumnDef<Event>[] = useMemo(
    () => [
      {
        accessorKey: "category",
        header: "Category",
        cell: () => <span>{category.name || "Uncategorized"}</span>,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Date
              <ArrowUpDown className="mt-2 size-4" />
            </Button>
          );
        },
        cell: ({ row }) =>
          new Date(row.getValue("createdAt")).toLocaleDateString(),
      },

      ...(data?.events[0]
        ? Object.keys(data.events[0].events.fields as object).map((field) => ({
            ascessorFn: (row: Event) =>
              (row.fields as Record<string, unknown>)[field],
            header: field,
            cell: ({ row }: { row: Row<Event> }) =>
              (row.original.fields as Record<string, unknown>)[field] || "-",
          }))
        : []),

      {
        accessorKey: "deliveryStatus",
        header: "Delivery status",
        cell: ({ row }) => (
          <span
            className={cn("rounded-full px-2 py-1 text-xs font-semibold", {
              "bg-green-100 text-green-800":
                row.getValue("deliveryS tatus") === "DELIVERED",
              "bg-red-100 text-red-800":
                row.getValue("deliveryS tatus") === "FAILED",
              "bg-yellow-100 text-yellow-800":
                row.getValue("deliveryS tatus") === "PENDING",
            })}
          >
            {row.getValue("deliveryStatus")}
          </span>
        ),
      },
    ],

    [category.name, data?.events],
  );

  const table = useReactTable({
    columns,
  });

  const numericFieldSums = useMemo(() => {
    if (!data?.events || data.events.length === 0) return {};

    const sums: Record<
      string,
      { total: number; thisWeek: number; thisMonth: number; today: number }
    > = {};

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const monthStart = startOfMonth(now);

    data.events.forEach(({ events: { fields, createdAt } }) => {
      const eventDate = new Date(createdAt);

      Object.entries(fields as object).forEach(([key, value]) => {
        const numValue = Number(value);
        if (!isNaN(numValue)) {
          if (!sums[key]) {
            sums[key] = { total: 0, thisWeek: 0, thisMonth: 0, today: 0 };
          }

          sums[key].total += numValue;

          if (
            isAfter(eventDate, weekStart) ||
            eventDate.getTime() === weekStart.getTime()
          ) {
            sums[key].thisWeek += numValue;
          }

          if (
            isAfter(eventDate, monthStart) ||
            eventDate.getTime() === monthStart.getTime()
          ) {
            sums[key].thisMonth += numValue;
          }

          if (isToday(eventDate)) {
            sums[key].today += numValue;
          }
        }
      });
    });

    return sums;
  }, [data?.events]);

  function NumericFieldSumsCard() {
    if (Object.keys(numericFieldSums).length === 0) {
      return null;
    }

    return Object.entries(numericFieldSums).map(([field, sums]) => {
      const relevantSums =
        activeTab === "today"
          ? sums.today
          : activeTab === "week"
            ? sums.thisWeek
            : sums.thisMonth;

      return (
        <Card key={field} className="border-2">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </p>
            <BarChartIcon className="size-4 text-muted-foreground" />
          </div>

          <div>
            <p className="text-2xl font-bold">{relevantSums.toFixed(2)}</p>
            <p className="text-xs/5 text-muted-foreground">
              {activeTab === "today"
                ? "Today"
                : activeTab === "week"
                  ? "This Week"
                  : "This Month"}
            </p>
          </div>
        </Card>
      );
    });
  }

  return (
    <div className="space-y-6">
      {/* @ts-expect-error value is always one of 3 values of active tab */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-2">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 border-brand-700">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm/6 font-medium">Total Events</p>
                <BarChartIcon className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-2xl font-bold">
                  {data?.eventsCount?.count || 0}
                </p>
                <p className="text-xs/5 text-muted-foreground">
                  Events{" "}
                  {activeTab === "today"
                    ? "Today"
                    : activeTab === "week"
                      ? "This Week"
                      : "This Month"}
                </p>
              </div>
            </Card>

            <NumericFieldSumsCard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
