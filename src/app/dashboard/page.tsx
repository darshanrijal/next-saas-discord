import { DashboardPage } from "@/components/DashboardPage";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardPageContent } from "./DashboardPageContent";
import { CreateEventCategoryModal } from "@/components/CreateEventCategoryModal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { createCheckoutSession } from "@/lib/stripe";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; success?: string }>;
}) {
  const auth = await currentUser();
  if (!auth) redirect("/sign-in");

  const user = await db.query.userTable.findFirst({
    where(fields, operators) {
      return operators.eq(fields.externalId, auth.id);
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const { intent, success } = await searchParams;

  if (intent === "upgrade") {
    const session = await createCheckoutSession(user.email, user.id);

    if (session.url) redirect(session.url);
  }

  return (
    <>
      {success === "true" && <></>}
      <DashboardPage
        cta={
          <CreateEventCategoryModal>
            <Button className="w-full sm:w-fit">
              <PlusIcon className="mr-2 size-4" />
              Add Category
            </Button>
          </CreateEventCategoryModal>
        }
        title="Dashboard"
      >
        <DashboardPageContent />
      </DashboardPage>
    </>
  );
}
