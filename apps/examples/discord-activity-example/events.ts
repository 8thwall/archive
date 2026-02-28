// Represents a Discord participant's data in the activity
type PlayerData = {
  userId: string
  username: string
  globalname: string
  avatar: string | null // Avatar hash, null if user has no custom avatar
}

// Array of player data representing all current participants
type PlayerUpdateEventData = PlayerData[]

// Centralized event names for type-safe event dispatching and listening
const Events = {
  PlayerUpdateEvent: 'playerUpdate',
}

export {
  Events,
}

export type {
  PlayerData,
  PlayerUpdateEventData,
}
