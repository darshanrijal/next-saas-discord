declare type ProjectGetUsage = {
  categoriesUsed: number
  categoriesLimit: number
  eventsUsed: number
  eventsLimit: number
  resetDate: Date
}

declare type CategoryResponse = {
  categories: {
    uniqueFieldCount: number
    eventsCount: number
    lastPing: Date | null
    name: string
    color: number
    emoji: string | null
    id: string
    createdAt: Date
    updatedAt: Date
  }[]
}
