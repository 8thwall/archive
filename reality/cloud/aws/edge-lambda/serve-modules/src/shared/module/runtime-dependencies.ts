import type {ModuleRuntimeDependency, ModuleRuntimeInfo} from './module-runtime'
import type {DependenciesById} from './validate-app-dependencies'
import {resolveModuleConfigValue} from './resolve-module-config-value'
import {makeRunQueue} from '../run-queue'
import {escapeHtml} from '../html'

const extractRuntimeDependencies = async (
  dependencies: DependenciesById, getFileContents: (filePath: string) => Promise<string> | string
) => {
  const queue = makeRunQueue(5)

  return Promise.all(Object.values(dependencies).map(async (dependency) => {
    const runtimeDependency: ModuleRuntimeDependency = {
      moduleId: dependency.moduleId,
      alias: dependency.alias,
      config: {},
    }

    if (dependency.config) {
      await Promise.all(Object.entries(dependency.config).map(([fieldName, value]) => (
        queue.next(async () => {
          try {
            runtimeDependency.config[fieldName] = await resolveModuleConfigValue(
              value,
              getFileContents
            )
          } catch (err) {
            if (value && typeof value === 'object') {
              if (value.type === 'asset') {
                throw new Error(`\
Failed to resolve file '${value.asset}' for parameter '${fieldName}' of \
module '${dependency.alias}'`)
              }
            }
            throw err
          }
        })
      )))
    }

    return runtimeDependency
  }))
}

const generateMetaForDependencies = async (
  appKey: string, dependencies: DependenciesById,
  getFileContents: (filePath: string) => Promise<string> | string
) => {
  if (!dependencies) {
    return ''
  }
  const runtimeDependencies = await extractRuntimeDependencies(dependencies, getFileContents)
  const runtimeInfo: ModuleRuntimeInfo = {appKey, dependencies: runtimeDependencies}
  const base64Data = Buffer.from(JSON.stringify(runtimeInfo), 'utf8').toString('base64')
  return `<meta name="8thwall:dependencies" content="${escapeHtml(base64Data)}">`
}

export {
  generateMetaForDependencies,
}
