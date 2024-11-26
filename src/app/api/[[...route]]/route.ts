import { Hono } from "hono"
import { handle } from "hono/vercel"

export const runtime = "edge"

const app = new Hono().basePath("/api").get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  })
})

export type AppType = typeof app

export const GET = handle(app)
export const POST = handle(app)
