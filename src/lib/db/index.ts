import env from '@/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

const dbSingleton = () => {
  return drizzle(env.DATABASE_URL, {
    schema,
  })
}

declare const globalThis: {
  dbGlobal: ReturnType<typeof dbSingleton>
} & typeof global

const db = globalThis.dbGlobal ?? dbSingleton()

export default db
