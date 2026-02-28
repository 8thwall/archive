import {PlayerData} from './events'

/**
 * Generates the Discord CDN URL for a user's avatar image
 * Returns custom avatar if available, otherwise returns Discord's default avatar
 */
const getAvatarUrl = (player: PlayerData) => {
  if (!player.userId) {
    console.warn('getAvatarUrl: Missing userId for player')
    return ''
  }

  let avatarSrc = '';
  if (player.avatar) {
    // User has a custom avatar - construct CDN URL
    avatarSrc = `https://cdn.discordapp.com/avatars/${player.userId}/${player.avatar}.png?size=256`;
  } else {
    // Use Discord's default avatar system (6 color variations based on user ID)
    const defaultAvatarIndex = (BigInt(player.userId) >> BigInt(22)) % BigInt(6);
    avatarSrc = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`
  }

  return avatarSrc
}

export {
  getAvatarUrl,
}