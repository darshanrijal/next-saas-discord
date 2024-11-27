import { AppType } from "@/app/api/[[...route]]/route"
import env from "@/env"
import { hc } from "hono/client"
import { createMiddleware } from "hono/factory"

export const { api } = hc<AppType>(env.NEXT_PUBLIC_BASE_URL)

type AuthCTX = {
  Variables: {}
}
export const authMiddleware = createMiddleware<AuthCTX>(async (c, next) => {
  return next()
})
