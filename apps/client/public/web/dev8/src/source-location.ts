import {BasicSourceMapConsumer, SourceMapConsumer} from 'source-map'
import type ErrorStackParser from 'error-stack-parser'

// eslint-disable-next-line max-len
import {ModuleFileRequest, parseRequestUri} from '../../../../../../reality/cloud/aws/edge-lambda/serve-modules/src/shared/module/module-file-request'

type SourceLocation = {
  moduleId?: string
  file?: string
  line?: number | null
  column?: number | null
}

type BaseInfo = SourceLocation & {
  function?: string
}

type SourceLocationPromise = Promise<SourceLocation | null>

type BaseInfoStack = (BaseInfo | null)[]

type StackPromise = Promise<BaseInfoStack>

const MAPPINGS_URL = 'https://cdn.8thwall.com/web/resources/mappings-kdkmc8qq.wasm'

const consumerPromiseMap: Record<string, Promise<BasicSourceMapConsumer | null>> = {}
let didInitializeMappings = false

const loadConsumer = async (mapPath: string) => {
  if (!didInitializeMappings) {
    SourceMapConsumer.initialize({'lib/mappings.wasm': MAPPINGS_URL})
    didInitializeMappings = true
  }
  try {
    const res = await fetch(mapPath, {redirect: 'follow'})
    if (!res.ok) {
      return null
    }
    const map = await res.json()
    return new SourceMapConsumer(map)
  } catch (err) {
    return null
  }
}

const getSourceMapConsumer = (mapPath: string) => {
  if (!consumerPromiseMap[mapPath]) {
    consumerPromiseMap[mapPath] = loadConsumer(mapPath)
  }
  return consumerPromiseMap[mapPath]
}

const isBundlePath = (b: string) => (!!b && (b.endsWith('/bundle.js') || b.endsWith('_bundle.js')))

// 'webpack:///app.js' -> 'app.js'
// 'webpack:///components/thing.tsx' -> 'components/thing.tsx'
const fixSourceFile = (path: string) => path.replace(/^webpack:\/\/\//, '')

const getModuleSourceLocation = async (
  parsedModulePath: ModuleFileRequest, file: string, line?: number, column?: number
): SourceLocationPromise => {
  if (typeof line !== 'number' || typeof column !== 'number') {
    return {moduleId: parsedModulePath.moduleId}
  }

  const consumer = await getSourceMapConsumer(file.replace('module.js', 'module.js.map'))

  const position = consumer?.originalPositionFor({line, column})
  if (!position || !position.source) {
    return {moduleId: parsedModulePath.moduleId}
  }
  return {
    moduleId: parsedModulePath.moduleId,
    file: fixSourceFile(position.source),
    line: position.line,
    column: position.column,
  }
}

const getSourceLocation = async (
  file?: string, line?: number, column?: number
): SourceLocationPromise => {
  if (!file) {
    return null
  }

  try {
    if (!isBundlePath(file)) {
      const parsedModulePath = parseRequestUri(new URL(file).pathname)
      return parsedModulePath && getModuleSourceLocation(parsedModulePath, file, line, column)
    }

    const consumer = await getSourceMapConsumer(`${file}.map`)

    if (!consumer || typeof line !== 'number' || typeof column !== 'number') {
      return null
    }

    const result = consumer.originalPositionFor({
      line,
      column,
    })

    if (!result || !result.source) {
      return null
    }

    return {
      file: fixSourceFile(result.source),
      line: result.line,
      column: result.column,
    }
  } catch (err) {
    return null
  }
}

const getSourceLocationForStackFrame = (stackFrame: ErrorStackParser.StackFrame) => (
  stackFrame && getSourceLocation(
    stackFrame.getFileName(),
    stackFrame.getLineNumber(),
    stackFrame.getColumnNumber()
  )
)

const getSourceLocationForErrorEvent = (errorEvent: ErrorEvent) => (
  errorEvent && getSourceLocation(
    errorEvent.filename,
    errorEvent.lineno,
    errorEvent.colno
  )
)

const processStack = (stack: ErrorStackParser.StackFrame[]): StackPromise => (
  stack && Promise.all(stack.map(async (stackFrame) => {
    if (!stackFrame) {
      return null
    }

    const baseInfo: BaseInfo = {
      function: stackFrame.getFunctionName(),
      line: stackFrame.getLineNumber(),
      column: stackFrame.getColumnNumber(),
      file: stackFrame.getFileName(),
    }

    const sourceLocation = await getSourceLocationForStackFrame(stackFrame)

    if (sourceLocation) {
      Object.assign(baseInfo, sourceLocation)
    }
    return baseInfo
  }))
)

export {
  getSourceLocationForStackFrame,
  getSourceLocationForErrorEvent,
  processStack,
}

export type {
  BaseInfoStack,
  SourceLocation,
  SourceLocationPromise,
  StackPromise,
}
