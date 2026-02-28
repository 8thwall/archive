type AccessLevelType = 'owned' | 'public' | 'purchased'

interface DependencyToken {
  version: number
  accessLevel: AccessLevelType
  moduleId: string
  accountUuid: string
  appUuid: string
}

interface DependencyTokenPayload extends DependencyToken {
  sub: 'dep'
  iat: number
}

export type {DependencyToken, DependencyTokenPayload, AccessLevelType}
