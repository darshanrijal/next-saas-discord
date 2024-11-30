import db from "@/lib/db"
import { userTable } from "@/lib/db/schema"
import { categoryRouter } from "@/server/category-router"
import { paymentRouter } from "@/server/payment-router"
import { projectRouter } from "@/server/project-router"
import { currentUser } from "@clerk/nextjs/server"
import { Hono } from "hono"
import { handle } from "hono/vercel"

const app = new Hono()
  .basePath("/api")
  .post("/synchronize", async (c) => {
    const auth = await currentUser()
    if (!auth) {
      return c.json({ isSync: false }, 400)
    }
    const user = await db.query.userTable.findFirst({
      where(fields, operators) {
        return operators.eq(fields.externalId, auth.id)
      },
    })

    if (!user) {
      await db.insert(userTable).values({
        quotaLimit: 100,
        email: auth.emailAddresses[0].emailAddress,
        externalId: auth.id,
      })
    }

    return c.json({ isSync: true })
  })
  .route("/categories", categoryRouter)
  .route("/payments", paymentRouter)
  .route("/project", projectRouter)

export type AppType = typeof app

export const GET = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)
