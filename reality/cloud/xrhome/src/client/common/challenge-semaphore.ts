/**
 * A ChallengeSemaphore is a signalling mechanism meant to notify all subscribers of
 * an action they should take and await their responses before a challenge on it resolves.
 */

interface SemaphoreChallenge {}
interface SemaphoreResponse {}
type ChallengeHandler<C, R> = (c: C) => (Promise<R> | R)

const PRIORITY_NORMAL = 0
const PRIORITY_EARLY = -1000
const PRIORITY_LATE = 1000

interface ChallengeSemaphore<
  C extends SemaphoreChallenge | void,
  R extends SemaphoreResponse | void
> {
  subscribe: (handler: ChallengeHandler<C, R>, opts?: {priority?: number}) => number
  unsubscribe: (id: number) => void
  postChallenge: (msg: C) => Promise<R[]>
}

const createChallengeSemaphore = <
  C extends SemaphoreChallenge | void,
  R extends SemaphoreResponse | void
>(): ChallengeSemaphore<C, R> => {
  let subscriberIdCount = 1
  const subscribers: Record<number, {handler: ChallengeHandler<C, R>, priority?: number}> = {}

  /**
   * Subscribed to the semaphore. When a challenge is issued, all subscribers
   * are notified. Returns a subscriber id that is used to unsubscribe.
   */
  const subscribe = (handler: ChallengeHandler<C, R>, opts?: {priority?: number}) => {
    const id = subscriberIdCount++
    subscribers[id] = {...opts, handler}
    return id
  }

  const unsubscribe = (id: number) => {
    delete subscribers[id]
  }

  /**
   * Returns as promise that resolves when all subscribers return/resolve.
   * @param msg Challenge data.
   * @return Promise that resolves to an array of responses once all subscribers resolve.
   */
  const postChallenge = async (msg: C): Promise<R[]> => {
    const allSubs = Object.values(subscribers).sort(
      (a, b) => (
        (a.priority || PRIORITY_NORMAL) - (b.priority || PRIORITY_NORMAL)
      )
    )
    const handlerArray: R[] = []
    const currPending: (Promise<R> | R)[] = []
    let currPriority = -Infinity
    for (let i = 0; i < allSubs.length; i++) {
      const currSub = allSubs[i]
      if (currSub.priority !== currPriority) {
        /* eslint-disable no-await-in-loop */
        handlerArray.push(...await Promise.all(currPending))
        currPending.length = 0
        currPriority = currSub.priority
      }
      currPending.push(currSub.handler(msg))
    }
    handlerArray.push(...await Promise.all(currPending))
    return handlerArray
  }

  return {
    subscribe,
    unsubscribe,
    postChallenge,
  }
}

export type {
  SemaphoreChallenge,
  SemaphoreResponse,
  ChallengeSemaphore,
  ChallengeHandler,
}

export {
  createChallengeSemaphore,
  PRIORITY_EARLY,
  PRIORITY_NORMAL,
  PRIORITY_LATE,
}
