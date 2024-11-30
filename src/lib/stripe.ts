import env from "@/env"
import Stripe from "stripe"

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
})

export const createCheckoutSession = async (
  userEmail: string,
  userId: string,
) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "price_1QQfIk08pbVKyRwNjzSrJCSc",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/dashboard/upgrade`,
    customer_email: userEmail,
    metadata: {
      userId,
    },
  })

  return session
}
