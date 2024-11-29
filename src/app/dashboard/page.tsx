import { DashboardPage } from "@/components/DashboardPage";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardPageContent } from "./DashboardPageContent";
import { CreateEventCategoryModal } from "@/components/CreateEventCategoryModal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default async function Page() {
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

  return (
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
  );
}
