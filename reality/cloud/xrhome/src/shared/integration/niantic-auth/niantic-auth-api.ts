import {entry} from '../../registry'
import type {createNianticAuthSentryImpl} from './niantic-auth-sentry-impl'

type INianticAuth = ReturnType<typeof createNianticAuthSentryImpl>

const NianticAuth = entry<INianticAuth>('niantic-auth')

export {
  NianticAuth,
}
