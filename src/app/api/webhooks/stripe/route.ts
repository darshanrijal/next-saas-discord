import env from "@/env"
import db from "@/lib/db"
import { userTable } from "@/lib/db/schema"
import { stripe } from "@/lib/stripe"
import { eq } from "drizzle-orm"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") ?? ""

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    env.STRIPE_WEBHOOK_KEY,
  )

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const { userId } = session.metadata || { userId: null }

    if (!userId) return new Response("Invalid metadata", { status: 400 })

    await db
      .update(userTable)
      .set({
        plan: "PRO",
      })
      .where(eq(userTable.id, userId))
  }

  return new Response("OK")
}
