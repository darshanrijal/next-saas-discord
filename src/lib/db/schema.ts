import { createId } from "@paralleldrive/cuid2"
import { InferSelectModel, relations } from "drizzle-orm"
import {
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const planEnum = pgEnum("Plan", ["FREE", "PRO"])
export const deliveryStatusEnum = pgEnum("DeliveryStatus", [
  "PENDING",
  "DELIVERED",
  "FAILED",
])

// Users
export const userTable = pgTable(
  "users",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    externalId: text("external_id").unique(),
    quotaLimit: integer("quota_limit").notNull(),
    plan: planEnum().notNull().default("FREE"),
    email: varchar({ length: 255 }).notNull().unique(),
    apiKey: text("api_key").notNull().unique().default(createId()),
    discordId: text("discord_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    emailIdx: index().on(t.email),
    apiKeyIdx: index().on(t.apiKey),
  }),
)

export type User = InferSelectModel<typeof userTable>

export const userRelations = relations(userTable, ({ many }) => ({
  eventCategories: many(eventCategoryTable),
  events: many(eventTable),
  quotas: many(quotaTable),
}))

// Event Categories
export const eventCategoryTable = pgTable(
  "event_categories",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    color: integer().notNull(),
    emoji: text(),
    userId: uuid().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    uniqueNameUserId: uniqueIndex().on(t.name, t.userId),
  }),
)

export type EventCategory = InferSelectModel<typeof eventCategoryTable>

export const eventCategoryRelations = relations(
  eventCategoryTable,
  ({ one, many }) => ({
    user: one(userTable, {
      fields: [eventCategoryTable.userId],
      references: [userTable.id],
    }),
    events: many(eventTable),
  }),
)

// Events
export const eventTable = pgTable(
  "events",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    fields: json().notNull(),
    formattedMessage: varchar({ length: 255 }).notNull(),
    userId: uuid().notNull(),
    name: varchar({ length: 255 }).notNull(),
    deliveryStatus: deliveryStatusEnum().notNull().default("PENDING"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    eventCategoryId: uuid(),
  },
  (t) => ({
    createdAtIdx: index().on(t.createdAt),
  }),
)

export type Event = InferSelectModel<typeof eventTable>

export const eventRelations = relations(eventTable, ({ one }) => ({
  user: one(userTable, {
    fields: [eventTable.userId],
    references: [userTable.id],
  }),
  eventCategory: one(eventCategoryTable, {
    fields: [eventTable.eventCategoryId],
    references: [eventCategoryTable.id],
  }),
}))

// Quotas
export const quotaTable = pgTable("quotas", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  userId: uuid().notNull().unique(),
  year: integer().notNull(),
  month: integer().notNull(),
  count: integer().notNull().default(0),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type Quota = InferSelectModel<typeof quotaTable>

export const quotaRelations = relations(quotaTable, ({ one }) => ({
  user: one(userTable, {
    fields: [quotaTable.userId],
    references: [userTable.id],
  }),
}))

// Types

export type EventCategoryWithEvents = EventCategory & {
  events: Event[]
}
