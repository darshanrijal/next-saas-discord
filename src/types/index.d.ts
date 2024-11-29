declare type DBUser = {
  id: string
  externalId: string | null
  quotaLimit: number
  plan: "FREE" | "PRO"
  email: string
  apiKey: string
  discordId: string | null
  createdAt: Date
  updatedAt: Date
}

declare type CategoryResponse = {
  categories: {
    uniqueFieldCount: number
    eventsCount: number
    lastPing: Date | null
    name: string
    id: string
    createdAt: Date
    updatedAt: Date
    color: number
    emoji: string | null
  }[]
}
