import { DashboardPage } from "@/components/DashboardPage";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ApiKeySettings } from "./ApiKeySettings";

export default async function Page() {
  const auth = await currentUser();
  if (!auth) redirect("/sign-in");

  const user = await db.query.userTable.findFirst({
    where(fields, operators) {
      return operators.eq(fields.externalId, auth.id);
    },
  });

  if (!user) return null;

  return (
    <DashboardPage title="API Key">
      <ApiKeySettings apiKey={user.apiKey} />
    </DashboardPage>
  );
}
