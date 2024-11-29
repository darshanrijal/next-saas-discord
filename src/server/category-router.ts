import db from "@/lib/db"
import { eventCategoryTable, eventTable } from "@/lib/db/schema"
import { parseColor } from "@/lib/utils"
import { createEventCategorySchema } from "@/lib/validation"
import { zValidator } from "@hono/zod-validator"
import { startOfDay, startOfMonth, startOfWeek } from "date-fns"
import { and, desc, eq, gte, sql } from "drizzle-orm"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import SuperJSON from "superjson"
import { z } from "zod"
import { authMiddleware } from "."

export const categoryRouter = new Hono()
  .get("/event-categories", authMiddleware, async (c) => {
    const user = c.get("user")
    const categories = await db.query.eventCategoryTable.findMany({
      where: eq(eventCategoryTable.userId, user.id),
      columns: {
        id: true,
        name: true,
        emoji: true,
        color: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy(fields, operators) {
        return operators.desc(fields.updatedAt)
      },
    })

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const now = new Date()
        const firstDayOfMonth = startOfMonth(now)

        const [uniqueFieldCount, eventsCount, lastPing] = await Promise.all([
          db.query.eventTable
            .findMany({
              where: and(
                eq(eventTable.eventCategoryId, category.id),
                gte(eventTable.createdAt, firstDayOfMonth),
              ),
              columns: {
                fields: true,
              },
            })
            .then((events) => {
              const fieldNames = new Set<string>()
              events.forEach((event) => {
                Object.keys(event.fields as Object).forEach((fieldName) => {
                  fieldNames.add(fieldName)
                })
              })

              return fieldNames.size
            }),

          db.$count(
            eventTable,
            and(
              eq(eventTable.eventCategoryId, category.id),
              gte(eventTable.createdAt, firstDayOfMonth),
            ),
          ),

          db.query.eventTable.findFirst({
            where: eq(eventTable.eventCategoryId, category.id),
            orderBy(fields, operators) {
              return operators.desc(fields.createdAt)
            },
            columns: {
              createdAt: true,
            },
          }),
        ])
        return {
          ...category,
          uniqueFieldCount,
          eventsCount,
          lastPing: lastPing?.createdAt || null,
        }
      }),
    )

    const data = SuperJSON.serialize({ categories: categoriesWithCount })

    return c.json(data)
  })
  .delete("/delete-category/:name", authMiddleware, async (c) => {
    const name = c.req.param("name")
    const { id } = c.get("user")
    await db
      .delete(eventCategoryTable)
      .where(
        and(
          eq(eventCategoryTable.name, name),
          eq(eventCategoryTable.userId, id),
        ),
      )

    return new Response()
  })
  .post(
    "/create-event-category",
    authMiddleware,
    zValidator("json", createEventCategorySchema),
    async (c) => {
      const { color, name, emoji } = c.req.valid("json")
      const user = c.get("user")
      await db.insert(eventCategoryTable).values({
        name: name.toLocaleLowerCase(),
        color: parseColor(color),
        emoji,
        userId: user.id,
      })

      return new Response()
    },
  )
  .post("/insert-quickstart-categories", authMiddleware, async (c) => {
    const user = c.get("user")
    const categories = await db
      .insert(eventCategoryTable)
      .values([
        {
          name: "bug",
          emoji: "🐛",
          color: 0xff6b6b,
          userId: user.id,
        },
        {
          name: "sale",
          emoji: "💰",
          color: 0xffeb3b,
          userId: user.id,
        },
        {
          name: "questions",
          emoji: "🤔",
          color: 0x6c5ce7,
          userId: user.id,
        },
      ])
      .returning()

    return c.json({ count: categories.length })
  })
  .get("/poll-category/:name", authMiddleware, async (c) => {
    const user = c.get("user")
    const name = c.req.param("name")
    const category = await db.query.eventCategoryTable.findFirst({
      where: and(
        eq(eventCategoryTable.userId, user.id),
        eq(eventCategoryTable.name, name),
      ),
      with: {
        events: true,
      },
    })

    if (!category)
      throw new HTTPException(404, { message: `category ${name} not found` })

    const hasEvents = !!category.events.length

    return c.json({ hasEvents })
  })
  .get(
    "/get-event-by-category-name",
    authMiddleware,
    zValidator(
      "query",
      z.object({
        name: z.string(),
        page: z.string(),
        limit: z.string(),
        timeRange: z.enum(["today", "week", "month"]),
      }),
    ),
    async (c) => {
      const user = c.get("user")
      const { limit, name, page, timeRange } = c.req.valid("query")

      const now = new Date()
      const startDate = {
        today: startOfDay(now),
        week: startOfWeek(now, { weekStartsOn: 0 }),
        month: startOfMonth(now),
      }[timeRange]

      const baseCondition = and(
        eq(eventCategoryTable.name, name),
        eq(eventCategoryTable.userId, user.id),
        gte(eventTable.createdAt, startDate),
      )

      const [events, [eventsCount], uniqueFieldCount] = await Promise.all([
        db
          .select()
          .from(eventTable)
          .innerJoin(
            eventCategoryTable,
            eq(eventTable.eventCategoryId, eventCategoryTable.id),
          )
          .where(baseCondition)
          .offset((Number(page) - 1) * Number(limit))
          .limit(Number(limit))
          .orderBy(desc(eventTable.createdAt)),

        db
          .select({
            count: sql<number>`COUNT(*)`.as("count"),
          })
          .from(eventTable)
          .innerJoin(
            eventCategoryTable,
            eq(eventTable.eventCategoryId, eventCategoryTable.id),
          )
          .where(baseCondition),

        db
          .select({ fields: eventTable.fields })
          .from(eventTable)
          .innerJoin(
            eventCategoryTable,
            eq(eventTable.eventCategoryId, eventCategoryTable.id),
          )
          .where(baseCondition)
          .then((events) => {
            const fieldNames = new Set<string>()
            events.forEach((event) => {
              Object.keys(event.fields as object).forEach((fieldName) =>
                fieldNames.add(fieldName),
              )
            })
            return fieldNames.size
          }),
      ])

      return c.json({
        events,
        eventsCount,
        uniqueFieldCount,
      })
    },
  )
