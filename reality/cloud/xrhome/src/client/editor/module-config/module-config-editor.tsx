import React from 'react'

import type {
  ModuleDependency, ModuleConfigValue, ModuleDependencyConfig,
} from '../../../shared/module/module-dependency'
import type {IGitFile} from '../../git/g8-dto'
import useActions from '../../common/use-actions'
import coreGitActions from '../../git/core-git-actions'
import {useCurrentGit, useGitFileContent, useGitRepo} from '../../git/hooks/use-current-git'
import {useAbandonableFunction} from '../../hooks/use-abandonable-function'
import {
  configReducer, fileChangeAction, initConfigState, saveStartAction, editFieldAction,
  resetFieldAction,
} from './module-config-editor-reducer'
import {FieldInput} from './field-input'
import {deriveConfigGrouping} from './derive-config-grouping'
import {InputGroup} from './input-group'
import type {ModuleManifest} from '../../../shared/module/module-manifest'
import WebsocketPool from '../../websockets/websocket-pool'
import {getEditorSocketSpecifier} from '../../common/hosting-urls'
import useCurrentApp from '../../common/use-current-app'
import {useDebounce} from '../../common/use-debounce'
import {resolveModuleConfigValue} from '../../../shared/module/resolve-module-config-value'
import {useHasDeviceTab} from '../logs/use-log-streams'
import type {ModuleConfigField} from '../../../shared/module/module-config'

interface IRawModuleConfigEditor {
  manifest: ModuleManifest
  config: ModuleDependencyConfig
  onFieldUpdate: (field: ModuleConfigField, value: ModuleConfigValue) => void
  onFieldReset: (field: ModuleConfigField) => void
}

const RawModuleConfigEditor: React.FC<IRawModuleConfigEditor> = ({
  manifest, config, onFieldUpdate, onFieldReset,
}) => (
  <>
    {deriveConfigGrouping(manifest.config).filter(e => e.fields.length).map(group => (
      <InputGroup key={group.groupId} name={group.name}>
        {group.fields.map(field => (
          <FieldInput
            key={field.fieldName}
            fieldName={field.fieldName}
            field={field}
            value={config[field.fieldName]}
            onChange={e => onFieldUpdate(field, e)}
            onReset={() => onFieldReset(field)}
          />
        ))}
      </InputGroup>
    ))}
  </>
)

interface IModuleConfigEditor {
  dependencyPath: string
  manifest: ModuleManifest
  moduleId: string
}

const ModuleConfigEditor: React.FC<IModuleConfigEditor> = ({
  dependencyPath, manifest, moduleId,
}) => {
  const repo = useGitRepo()

  const {transformFile} = useActions(coreGitActions)

  const transformFileAbandonable = useAbandonableFunction(transformFile)

  const fileContent = useGitFileContent(dependencyPath)

  const filesByPath = useCurrentGit(git => git.filesByPath)

  const [configState, dispatch] = React.useReducer(configReducer, fileContent, initConfigState)

  const git = useCurrentGit()
  const app = useCurrentApp()

  const broadcast = useDebounce({current: WebsocketPool.broadcastMessage}, 350)

  const hasChanges = configState.needsSave

  const hasDeviceTab = useHasDeviceTab(app.appKey)

  React.useEffect(() => {
    dispatch(fileChangeAction(fileContent))
  }, [fileContent])

  React.useEffect(() => {
    if (!hasChanges) {
      return undefined
    }

    const timeout = setTimeout(async () => {
      await transformFileAbandonable(repo, dependencyPath, (file: IGitFile) => {
        const dep = JSON.parse(file.content) as ModuleDependency
        dep.config = configState.config
        const newContent = JSON.stringify(dep, null, 2)
        dispatch(saveStartAction(newContent))
        return newContent
      })
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [dependencyPath, transformFile, hasChanges, configState])

  const broadcastToDevice = (event: {action: string, data: any}) => {
    const {alias} = JSON.parse(fileContent) as ModuleDependency
    const specifier = getEditorSocketSpecifier({git, app} as any, 'current-client')
    event.data.moduleId = moduleId
    event.data.updateMsg = `[${alias}] ${event.data.updateMsg}`
    broadcast(specifier, event)
  }

  const updateConfigField = async (field: ModuleConfigField, value: ModuleConfigValue) => {
    if (hasDeviceTab) {
      const newValue = await resolveModuleConfigValue(
        value, path => filesByPath[path]?.content
      )
      const newConfig = {[field.fieldName]: newValue}
      broadcastToDevice({
        action: 'MODULE_CONFIG_UPDATE',
        data: {
          newConfig,
          updateMsg: `${field.label} = ${newValue}`,
        },
      })
    }
    dispatch(editFieldAction(field.fieldName, value))
  }

  const resetConfigField = (field: ModuleConfigField) => {
    if (hasDeviceTab) {
      broadcastToDevice({
        action: 'MODULE_CONFIG_RESET',
        data: {
          configFieldName: field.fieldName,
          updateMsg: `${field.label} reset to default`,
        },
      })
    }
    dispatch(resetFieldAction(field.fieldName))
  }

  return (
    <RawModuleConfigEditor
      manifest={manifest}
      config={configState.config}
      onFieldUpdate={updateConfigField}
      onFieldReset={resetConfigField}
    />
  )
}

export {
  ModuleConfigEditor,
  RawModuleConfigEditor,
}
