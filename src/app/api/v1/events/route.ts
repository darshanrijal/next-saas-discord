import { FREE_QUOTA, PRO_QUOTA } from "@/constants"
import db from "@/lib/db"
import { eventTable, quotaTable, userTable } from "@/lib/db/schema"
import { DiscordClient } from "@/lib/discord"
import { APIEmbed } from "discord-api-types/v10"
import { and, eq, sql } from "drizzle-orm"
import { NextRequest } from "next/server"
import { ZodError, z } from "zod"

const REQUEST_VALIDATOR = z
  .object({
    category: z.string().min(1),
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

    const dmChannel = await discord.createDM(user.discordId)
    let requestData: unknown

    requestData = await req.json()

    const validatonResult = REQUEST_VALIDATOR.parse(requestData)

    const category = user.eventCategories.find(
      (category) => category.name === validatonResult.category,
    )

    if (!category) {
      return Response.json(
        {
          message: `You dont have a category named ${validatonResult.category}`,
        },
        { status: 404 },
      )
    }

    const eventData = {
      title: `${category.emoji ?? "🔔"} ${category.name.charAt(0).toUpperCase() + category.name.slice(1)}`,
      description:
        validatonResult.description ??
        `A new ${category.name} event has occured!`,
      color: category.color,
      timestamp: new Date().toISOString(),
      fields: Object.entries(validatonResult.fields ?? []).map(
        ([key, value]) => ({
          name: key,
          value: String(value),
          inline: true,
        }),
      ),
    } satisfies APIEmbed

    const [event] = await db
      .insert(eventTable)
      .values({
        name: category.name,
        formattedMessage: `${eventData.title}\n\n${eventData.description}`,
        userId: user.id,
        fields: validatonResult.fields ?? {},
        eventCategoryId: category.id,
      })
      .returning()

    await discord.sendEmbed(dmChannel.id, eventData)

    await db
      .update(eventTable)
      .set({
        deliveryStatus: "DELIVERED",
      })
      .where(eq(eventTable.id, event.id))

    await db.transaction(async (tx) => {
      const q = await tx.query.quotaTable.findFirst({
        where: and(
          eq(quotaTable.userId, user.id),
          eq(quotaTable.month, currentMonth),
          eq(quotaTable.year, currentYear),
        ),
      })
      if (q) {
        await tx
          .update(quotaTable)
          .set({
            count: sql`${quotaTable.count} + 1`,
          })
          .where(eq(quotaTable.id, q.id))
          .returning()
      }

      await tx
        .insert(quotaTable)
        .values({
          userId: user.id,
          month: currentMonth,
          year: currentYear,
          count: 1,
        })
        .returning()
    })

    return Response.json(
      { message: "Event processed successfully" },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
