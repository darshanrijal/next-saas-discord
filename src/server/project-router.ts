import { Hono } from "hono"
import { authMiddleware } from "."
import { addMonths, startOfMonth } from "date-fns"
import db from "@/lib/db"
import { eventCategoryTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { FREE_QUOTA, PRO_QUOTA } from "@/constants"
import SuperJSON from "superjson"

export const projectRouter = new Hono().get(
  "/get-usage",
  authMiddleware,
  async (c) => {
    const user = c.get("user")
    const currDate = startOfMonth(new Date())

    const quota = await db.query.quotaTable.findFirst({
      where(fields, { and, eq }) {
        return and(
          eq(fields.userId, user.id),
          eq(fields.year, currDate.getFullYear()),
          eq(fields.month, currDate.getMonth() + 1),
        )
      },
    })

    const eventCount = quota?.count ?? 0

    const categoryCount = await db.$count(
      eventCategoryTable,
      eq(eventCategoryTable.userId, user.id),
    )

    const limit = user.plan === "PRO" ? PRO_QUOTA : FREE_QUOTA

    const resetDate = addMonths(currDate, 1)

    const data = {
      categoriesUsed: categoryCount,
      categoriesLimit: limit.maxEventsCategorires,
      eventsUsed: eventCount,
      eventsLimit: limit.maxEventsPerMonth,
      resetDate,
    }

    const serializedData = SuperJSON.serialize(data)
    return c.json(serializedData)
  },
)
