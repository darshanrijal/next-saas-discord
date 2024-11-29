import { DashboardPage } from "@/components/DashboardPage";
import db from "@/lib/db";
import { eventCategoryTable, userTable } from "@/lib/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import React from "react";
import { CategoryPageContent } from "./CategoryPageContent";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const auth = await currentUser();
  if (!auth) return null;

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.externalId, auth.id),
  });

  if (!user) notFound();

  const category = await db.query.eventCategoryTable.findFirst({
    where: and(
      eq(eventCategoryTable.name, name),
      eq(eventCategoryTable.userId, user.id),
    ),
    with: {
      events: true,
    },
  });

  if (!category) notFound();

  const hasEvents = !!category.events.length;

  return (
    <DashboardPage title={`${category.emoji} ${category.name} events`}>
      <CategoryPageContent hasEvents={hasEvents} category={category} />
    </DashboardPage>
  );
}
