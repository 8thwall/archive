const getPlatform = (): string => {
  if (navigator.userAgent.includes('Quest 3')) {
    return 'quest3'
  }
  if (navigator.userAgent.includes('Quest 2')) {
    return 'quest2'
  }
  if (navigator.userAgent.includes('Quest Pro')) {
    return 'questpro'
  }
  const platformString = navigator.platform.toLowerCase()
  if (platformString.includes('android')) {
    return 'android'
  }
  return 'desktop'
}

const checkPc = (): boolean => {
  console.log(navigator.userAgent)
  return navigator.userAgent.includes('Windows')
}

const checkQuestBrowser = (): boolean => navigator.userAgent.includes('OculusBrowser')

const checkNae = (): boolean => !!globalThis.__nia

const Platform = {
  appPlatform: getPlatform(),
  isPc: checkPc(),
  isNativeQuest: checkNae(),
  isQuestBrowser: checkQuestBrowser(),
}
export {Platform}
