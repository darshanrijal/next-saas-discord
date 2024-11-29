"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Modal } from "@/components/modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate, formatDistanceToNow, set } from "date-fns";
import {
  ArrowRight,
  BarChart2,
  ClockIcon,
  DatabaseIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SuperJSON from "superjson";
import { DashboardEmptyState } from "./DashboardEmptyState";

export const DashboardPageContent = () => {
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const { data, isPending, error } = useQuery({
    queryKey: ["user-event-categories"],
    queryFn: async () => {
      const res = await api.categories["event-categories"].$get();
      const json = await res.json();
      const data = SuperJSON.deserialize(json) satisfies CategoryResponse;
      return data;
    },
  });
  const queryClient = useQueryClient();
  const { mutate: deleteCategory, isPending: isDeletingCategory } = useMutation(
    {
      mutationFn: async (name: string) => {
        await api.categories["delete-category"][":name"].$delete({
          param: { name },
        });
      },
      onSuccess: async () => {
        await queryClient.cancelQueries({
          queryKey: ["user-event-categories"],
        });
        const prevState = queryClient.getQueryData(["user-event-categories"]);
        queryClient.setQueryData<CategoryResponse>(
          ["user-event-categories"],
          (oldData) => {
            if (!oldData) return;
            return {
              categories: oldData.categories.filter(
                (c) => c.name !== deletingCategory,
              ),
            };
          },
        );
        setDeletingCategory(null);
      },
    },
  );

  if (isPending) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-destructive">{error.message}</p>;
  }

  if (!data.categories.length) {
    return <DashboardEmptyState />;
  }
  return (
    <>
      <ul className="grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {data.categories.map((category) => (
          <li
            key={category.id}
            className="group relative z-10 transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="absolute inset-px z-0 rounded-lg bg-white" />

            <div className="pointer-events-none absolute inset-px z-0 rounded-lg shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:shadow-md" />

            <div className="relative z-10 p-6">
              <div className="mb-6 flex items-center gap-4">
                <div
                  className="size-12 rounded-full"
                  style={{
                    backgroundColor: category.color
                      ? `#${category.color.toString(16).padStart(6, "0")}`
                      : "#f3f4f6",
                  }}
                />
                <div>
                  <h3 className="text-lg/7 font-medium tracking-tight text-gray-950">
                    {category.emoji || "📂"} {category.name}
                  </h3>
                  <p className="text-sm/6 text-gray-600">
                    {formatDate(category.createdAt, "MMM d,yyyy")}
                  </p>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center text-sm/5 text-gray-600">
                  <ClockIcon className="mr-2 size-4 text-brand-500" />
                  <span className="font-medium">Last ping:</span>
                  <span className="ml-1">
                    {category.lastPing
                      ? formatDistanceToNow(category.lastPing, {
                          addSuffix: true,
                        })
                      : "Never"}
                  </span>
                </div>

                <div className="flex items-center text-sm/5 text-gray-600">
                  <DatabaseIcon className="mr-2 size-4 text-brand-500" />
                  <span className="font-medium">Unique fields:</span>
                  <span className="ml-1">{category.uniqueFieldCount}</span>
                </div>

                <div className="flex items-center text-sm/5 text-gray-600">
                  <BarChart2 className="mr-2 size-4 text-brand-500" />
                  <span className="font-medium">Events this month:</span>
                  <span className="ml-1">{category.eventsCount}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={`/dashboard/category/${encodeURIComponent(category.name)}`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "flex items-center gap-2 text-sm",
                  })}
                >
                  View all <ArrowRight className="size-4" />
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 transition-colors hover:text-red-600"
                  aria-label={`Delete ${category.name} category`}
                  title={`Delete ${category.name} category`}
                  onClick={() => setDeletingCategory(category.name)}
                >
                  <Trash2 className="size-5" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        showModal={!!deletingCategory}
        setShowModal={() => setDeletingCategory(null)}
        className="max-w-md p-8"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
              Delete category
            </h2>
            <p className="text-sm/6 text-gray-600">
              Are you sure you want to delete the category "{deletingCategory}"
              This action cannot be undone
            </p>
          </div>

          <div className="flex justify-end space-x-3 border-t pt-4">
            <Button variant="outline" onClick={() => setDeletingCategory(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={
                deletingCategory
                  ? () => deleteCategory(deletingCategory)
                  : undefined
              }
              disabled={isDeletingCategory}
            >
              {isDeletingCategory ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
