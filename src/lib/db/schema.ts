import { pgTable, uuid } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: uuid().notNull().primaryKey().defaultRandom(),
})
