import * as ecs from '@8thwall/ecs'

import {Events} from './events'
import type {PlayerData} from './events'
import {DiscordSDK, Events as DiscordEvents} from './lib/discord-embedded-app-sdk'

/**
 * Factory function that creates a Discord API handler
 * Manages Discord SDK initialization, authentication, and data fetching
 */
const discordHandler = async (world: ecs.World, eid: ecs.Eid) => {
  let discordSdk = null
  let auth: {user: string, access_token: string} | null = null

  /**
   * Transforms Discord participant data and dispatches it as an app event
   * Called whenever participants join/leave the activity
   */
  const updateParticipantsCallback = (
    data: any
  ) => {
    if (!data || !data.participants || data.participants.length === 0) {
      return
    }

    const playerUpdateEventData = data.participants.map(participant => ({
      userId: participant.id,
      username: participant.username,
      globalname: participant.global_name,
      avatar: participant.avatar,
    } as PlayerData))

    world.events.dispatch(eid, Events.PlayerUpdateEvent, playerUpdateEventData)
  }

  /**
   * Initializes Discord SDK and completes OAuth flow
   * Steps: 1) Ready SDK 2) Authorize user 3) Exchange code for token 4) Authenticate
   * Returns true if setup succeeds, false otherwise
   */
  const setup = async (clientId: string): Promise<boolean> => {
    try {
      // Initialize Discord SDK with your application's client ID
      discordSdk = new DiscordSDK(clientId)
      await discordSdk.ready()

      // Step 1: Request authorization from Discord
      const {code} = await discordSdk.commands.authorize({
        client_id: clientId,
        response_type: 'code',
        state: '',
        prompt: 'none',
        scope: [
          'identify',
          'guilds',
          'applications.commands',
        ],
      })

      // Step 2: Exchange authorization code for access token via backend
      const response = await fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
        }),
      })

      const {access_token: accessToken} = await response.json()

      // Step 3: Authenticate with Discord using the access token
      auth = await discordSdk.commands.authenticate({
        access_token: accessToken,
      })

      if (auth == null) {
        throw new Error('Authenticate command failed')
      }

      // Fetch initial list of participants in the activity
      const participants = await discordSdk.commands.getInstanceConnectedParticipants()
      updateParticipantsCallback(participants)

      // Subscribe to real-time participant updates (joins/leaves)
      discordSdk.subscribe(
        DiscordEvents.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE,
        updateParticipantsCallback
      )
    } catch (e) {
      console.error('Discord setup error:', e)
      return false
    }

    return true
  }

  /**
   * Fetches the name of the current Discord channel
   * Returns null if SDK not initialized or channel info unavailable
   */
  const getChannelName = async (): Promise<string | null> => {
    if (!discordSdk) {
      console.warn('Discord SDK not initialized')
      return null
    }

    try {
      if (discordSdk.channelId != null && discordSdk.guildId != null) {
        const channel = await discordSdk.commands.getChannel({channel_id: discordSdk.channelId})
        if (channel.name != null) {
          return channel.name
        }
      }
    } catch (e) {
      console.error('Error getting channel name:', e)
    }

    return null
  }

  /**
   * Fetches information about the current Discord guild (server)
   * Uses Discord API to get guild data based on the authenticated user
   */
  const getGuild = async () => {
    if (!discordSdk) {
      console.warn('Discord SDK not initialized')
      return null
    }

    // Fetch user's guilds from Discord API using access token
    const guilds = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        'Authorization': `Bearer ${auth?.access_token}`,
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())

    // Find the guild that matches the current activity's guild ID
    const currentGuild = guilds?.find(g => g.id === discordSdk.guildId)

    if (currentGuild != null) {
      return currentGuild
    }

    return null
  }

  // Return public API for interacting with Discord
  return {
    setup,
    getChannelName,
    getGuild,
  }
}

export {
  discordHandler,
}
