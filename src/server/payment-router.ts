import { Hono } from "hono"
import { authMiddleware } from "."
import { createCheckoutSession } from "@/lib/stripe"

export const paymentRouter = new Hono()
  .post("/create-checkout-session", authMiddleware, async (c) => {
    const user = c.get("user")
    const session = await createCheckoutSession(user.email, user.id)

    return c.json({ url: session.url })
  })
  .get("/get-user-plan", authMiddleware, async (c) => {
    const user = c.get("user")
    return c.json({ plan: user.plan })
  })
