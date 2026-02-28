/*
  Example:
  e8.sendEvent('Free Trial - Click Opt In Newsletter')}
*/

const MAX_EVENT_NAME_LENGTH = 40

const sendEvent = (eventName: string) => {
  if (eventName.length > 40) {
    throw new Error(`Event names cannot exceed ${MAX_EVENT_NAME_LENGTH} characters}`)
  }

  return window?.dataLayer?.push({
    event: 'e8',
    e8EventName: eventName,
  })
}

export default {
  sendEvent,
}
