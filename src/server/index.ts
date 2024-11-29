import db from "@/lib/db"
import { userTable } from "@/lib/db/schema"
import { currentUser } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"

type AuthCTX = {
  Variables: {
    user: DBUser
  }
}

export const authMiddlewate = createMiddleware<AuthCTX>(async (c, next) => {
  const authHeader = c.req.header("Authorization")

  if (authHeader) {
    const apiKey = authHeader.split(" ")[1]
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.apiKey, apiKey),
    })

    if (!user) {
      throw new HTTPException(401, { message: "Unauthorized" })
    }

    c.set("user", user)
    return next()
  }

  const auth = await currentUser()

  if (!auth) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.externalId, auth.id),
  })

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }
  c.set("user", user)
  return next()
})
