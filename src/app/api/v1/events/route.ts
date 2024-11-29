import { FREE_QUOTA, PRO_QUOTA } from "@/constants"
import db from "@/lib/db"
import { quotaTable, userTable } from "@/lib/db/schema"
import { DiscordClient } from "@/lib/discord"
import { createEventCategorySchema } from "@/lib/validation"
import { and, eq } from "drizzle-orm"
import { NextRequest } from "next/server"
import { z } from "zod"

const REQUEST_VALIDATOR = z
  .object({
    category: createEventCategorySchema,
    fields: z.record(z.string().or(z.number()).or(z.boolean()).optional()),
    description: z.string().optional(),
  })
  .strict()

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (!authHeader.startsWith("Bearer ")) {
      return Response.json(
        { message: "Invalid auth header format. Expected 'Bearer <API_KEY>'" },
        { status: 401 },
      )
    }

    const apiKey = authHeader.split(" ")[1]

    if (!apiKey || apiKey.trim() === "") {
      return Response.json({ message: "Invalid API Key" }, { status: 401 })
    }

    const user = await db.query.userTable.findFirst({
      where: eq(userTable.apiKey, apiKey),
      with: {
        eventCategories: true,
      },
    })

    if (!user) {
      return Response.json({ message: "Invalid API Key" }, { status: 401 })
    }

    if (!user.discordId) {
      return Response.json(
        {
          message: "Please enter your discord ID in your account settings",
        },
        { status: 403 },
      )
    }

    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()

    const quota = await db.query.quotaTable.findFirst({
      where: and(
        eq(quotaTable.userId, user.id),
        eq(quotaTable.month, currentMonth),
        eq(quotaTable.year, currentYear),
      ),
    })

    const quotaLimit =
      user.plan === "FREE"
        ? FREE_QUOTA.maxEventsPerMonth
        : PRO_QUOTA.maxEventsPerMonth

    if (quota && quota.count >= quotaLimit) {
      return Response.json(
        { message: "Monthly quota reached" },
        { status: 429 },
      )
    }

    const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN)
  } catch (error) {}
}
