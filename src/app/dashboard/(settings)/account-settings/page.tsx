import { DashboardPage } from "@/components/DashboardPage";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AccountSettings } from "./AccountSettings";

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
    <DashboardPage title="Account settings">
      <AccountSettings discordId={user.discordId} />
    </DashboardPage>
  );
}
