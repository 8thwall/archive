import * as ecs from '@8thwall/ecs'

import {Events} from './events'
import type {PlayerUpdateEventData} from './events'
import {discordHandler} from './discord-api-handler'
import {getAvatarUrl} from './discord-utils'
import {
  addBasicUI,
} from './ui-utils'
import type {BasicUiObject, BasicUiOptions} from './ui-utils'

// Replace with your actual Discord Application Client ID
const DISCORD_APPLICATION_CLIENT_ID = '<REMOVED>'

// UI positioning constants
const INITIAL_UI_HEIGHT = 1.5 // Height for channel/guild info display
const PLAYER_UI_START_HEIGHT = 2.5 // Starting height for first player UI
const PLAYER_UI_SPACING = 1.025 // Vertical spacing between player UI elements

ecs.registerComponent({
  name: 'discord-example',
  stateMachine: ({world, eid, defineState}) => {
    // Track UI elements for each Discord participant by their user ID
    const playerMap = new Map<string, BasicUiObject>()

    // Callback that syncs UI with Discord participants list changes
    const playerUpdateCallback = (event: any) => {
      const players = event.data as PlayerUpdateEventData

      // Compare current UI state with new participant list
      const currentPlayerIds = new Set(playerMap.keys())
      const newPlayerIds = new Set(players.map(p => p.userId))

      // Clean up UI for participants who left the activity
      for (const userId of currentPlayerIds) {
        if (!newPlayerIds.has(userId)) {
          const playerUiObject = playerMap.get(userId)
          if (playerUiObject !== undefined) {
            world.deleteEntity(playerUiObject.eid)
            playerMap.delete(userId)
          }
        }
      }

      // Create or update UI for current participants
      players.forEach((player, index) => {
        // Calculate vertical position (stacks players from top to bottom)
        const yOffset = PLAYER_UI_START_HEIGHT + (index * PLAYER_UI_SPACING)
        const displayText = `Player ${index + 1}: ${player.globalname} - ${player.username}`
        const avatarUrl = getAvatarUrl(player)

        if (!playerMap.has(player.userId)) {
          // Create new UI entity for this participant (avatar + username display)
          const playerUiObject = addBasicUI(world, {
            text: displayText,
            yOffset,
            imageUrl: avatarUrl
          })
          playerMap.set(player.userId, playerUiObject)
        } else {
          // Update existing participant's position and display text
          const playerUiObject = playerMap.get(player.userId)
          if (playerUiObject !== undefined) {
            ecs.Position.set(world, playerUiObject.eid, {x: 0, y: yOffset, z: 0})
            ecs.Ui.set(world, playerUiObject.textEid, {text: displayText})
          }
        }
      })
    }

    defineState('active')
      .initial()
      .onEnter(async () => {
        // Listen for participant updates from Discord
        world.events.addListener(eid, Events.PlayerUpdateEvent, playerUpdateCallback)

        // Initialize Discord SDK and authenticate
        const discord = await discordHandler(world, eid)
        const setupSuccess = await discord.setup(DISCORD_APPLICATION_CLIENT_ID)

        const defaultUiOptions: BasicUiOptions = {
          text: '',
          yOffset: INITIAL_UI_HEIGHT
        }

        if (!setupSuccess) {
          // Show error message if not running in Discord environment
          defaultUiOptions.text = 'This project must be run in a Discord activity'
          addBasicUI(world, defaultUiOptions)

          console.error('Discord setup failed - not running in Discord')
          return
        }

        // Fetch and display current channel and guild information
        const channelName = await discord.getChannelName()
        const guild = await discord.getGuild()

        if (channelName && guild) {
          defaultUiOptions.text = `Channel: ${channelName}\nGuild: ${guild.name}`
          addBasicUI(world, defaultUiOptions)
        }
      })
      .onExit(() => {
        // Clean up event listener when component is removed
        world.events.removeListener(eid, Events.PlayerUpdateEvent, playerUpdateCallback)
      })
  },
})
