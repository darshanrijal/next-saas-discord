"use client";

import { EventCategoryWithEvents } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";
import { EmptyCategoryState } from "./EmptyCategoryState";

interface CategoryPageContentProps {
  hasEvents: boolean;
  category: EventCategoryWithEvents;
}
export const CategoryPageContent = ({
  hasEvents: initialHasEvents,
  category,
}: CategoryPageContentProps) => {
  const { data: pollingData } = useQuery<{ hasEvents: boolean }>({
    queryKey: ["category", category.name, "hasEvents"],
    initialData: {
      hasEvents: initialHasEvents,
    },
  });

  if (!pollingData.hasEvents) {
    return <EmptyCategoryState categoryName={category.name} />;
  }
  return <pre>{JSON.stringify(category.events, null, 2)}</pre>;
};
