type ModuleTarget =
  {type: 'branch', branch: string} |
  {type: 'commit', branch: string, commit: string} |
  {type: 'channel', channel: string} |
  {type: 'development', handle: string} |
  ModuleVersionTarget

type Major = {major: number}
type Minor = {minor: number}
type Patch = {patch: number}

type P<T> = Partial<T>

type ModuleVersionTarget =
  {type: 'version', level: 'major', pre?: never} & Major & P<Minor> & P<Patch> |
  {type: 'version', level: 'minor', pre?: never} & Major & Minor & P<Patch> |
  {type: 'version', level: 'patch', pre?: never} & Major & Minor & Patch |
  {type: 'version', level: 'major' | 'minor' | 'patch', pre: true} & Major & Minor & Patch

type ModuleVersionTargetLevel = ModuleVersionTarget['level']

type TargetParseResult = {
  target: ModuleTarget
  remainder: string[]
}

const versionRegex = /^(0|[1-9][0-9]*)$/g

const parseVersionNumber = (t: string) => (
  t && t.match(versionRegex) ? Number.parseInt(t, 10) : NaN)

const parseModuleTarget = (targetParts: Readonly<string[]>): TargetParseResult => {
  if (targetParts.length === 0) {
    return null
  }

  let consumedPartCount = 0
  const consumePart = (): string | null => {
    if (consumedPartCount >= targetParts.length) {
      return null
    }
    const next = targetParts[consumedPartCount]
    consumedPartCount++
    return next
  }
  let target: ModuleTarget

  const type = consumePart()

  switch (type) {
    case 'branch': {
      const branch = consumePart()
      target = branch && {type, branch}
      break
    }
    case 'commit': {
      const branch = consumePart()
      const commit = consumePart()
      target = branch && commit && {type, branch, commit}
      break
    }
    case 'channel': {
      const channel = consumePart()

      target = channel && {type, channel}
      break
    }
    case 'development': {
      const prefix = consumePart()
      const handle = consumePart()
      target = prefix === 'handle' && handle && {type, handle}
      break
    }
    case 'version': {
      const level = consumePart()
      switch (level) {
        case 'major': {
          const major = parseVersionNumber(consumePart())
          target = Number.isInteger(major) && {type, level, major}
          break
        }
        case 'minor': {
          const major = parseVersionNumber(consumePart())
          const minor = parseVersionNumber(consumePart())
          target = Number.isInteger(major) && Number.isInteger(minor) &&
                   {type, level, major, minor}
          break
        }
        case 'patch': {
          const major = parseVersionNumber(consumePart())
          const minor = parseVersionNumber(consumePart())
          const patch = parseVersionNumber(consumePart())
          target = Number.isInteger(major) && Number.isInteger(minor) &&
                   Number.isInteger(patch) && {type, level, major, minor, patch}
          break
        }
        case 'pre': {
          const rawSublevel = consumePart()
          const validSubLevel = (['major', 'minor', 'patch']).includes(rawSublevel)
            ? rawSublevel as 'major' | 'minor' | 'patch'
            : null
          const major = parseVersionNumber(consumePart())
          const minor = parseVersionNumber(consumePart())
          const patch = parseVersionNumber(consumePart())
          target = validSubLevel &&
                   Number.isInteger(major) &&
                   Number.isInteger(minor) &&
                   Number.isInteger(patch) && {
            type,
            level: validSubLevel,
            major,
            minor,
            patch,
            pre: true,
          }
          break
        }
        default:
          break
      }
      break
    }
    default:
      return null
  }

  if (!target) {
    return null
  }

  return {
    target,
    remainder: targetParts.slice(consumedPartCount),
  }
}
const getModuleTargetParts = (target: ModuleTarget) => {
  const parts: string[] = [target.type]
  switch (target.type) {
    case 'commit':
      parts.push(target.branch, target.commit)
      break
    case 'branch':
      parts.push(target.branch)
      break
    case 'channel':
      parts.push(target.channel)
      break
    case 'development':
      parts.push('handle', target.handle)
      break
    case 'version':
      if (target.pre) {
        parts.push('pre', target.level, target.major.toString(),
          target.minor.toString(), target.patch.toString())
      } else {
        switch (target.level) {
          case 'major':
            parts.push(target.level, target.major.toString())
            break
          case 'minor':
            parts.push(target.level, target.major.toString(), target.minor.toString())
            break
          case 'patch':
            parts.push(target.level, target.major.toString(),
              target.minor.toString(), target.patch.toString())
            break
          default:
            throw new Error(`Cannot process invalid level type: ${(target as any).level}`)
        }
      }

      break
    default:
      throw new Error(`Cannot process invalid target type: ${(target as any).type}`)
  }

  return parts
}
export {
  ModuleTarget,
  ModuleVersionTarget,
  ModuleVersionTargetLevel,
  parseModuleTarget,
  getModuleTargetParts,
}
