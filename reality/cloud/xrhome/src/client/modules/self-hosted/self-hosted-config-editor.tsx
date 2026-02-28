import React from 'react'
import type {DeepReadonly} from 'ts-essentials'

import type {ModuleConfigField} from '../../../shared/module/module-config'
import type {ModuleDependency, ModuleConfigValue} from '../../../shared/module/module-dependency'
import type {DependencyUpdater} from './self-hosted-reducer'
import {RawModuleConfigEditor} from '../../editor/module-config/module-config-editor'
import {Loader} from '../../ui/components/loader'
import {useModuleManifest} from '../../editor/modules/use-module-manifest'
import {StaticBanner} from '../../ui/components/banner'

interface ISelfHostedModuleConfigEditor {
  dependency: DeepReadonly<ModuleDependency>
  onChange: (updater: DependencyUpdater) => void
}

const SelfHostedModuleConfigEditor: React.FC<ISelfHostedModuleConfigEditor> = ({
  dependency, onChange,
}) => {
  const isDev = false  // TODO(christoph): Development mode logic
  const manifestState = useModuleManifest(dependency, isDev)

  if (manifestState.status === 'error') {
    return <StaticBanner type='danger'>Failed to load manifest</StaticBanner>
  }

  const isLoading = manifestState.status === 'loading'
  if (isLoading) {
    return <Loader centered inline />
  }

  if (manifestState.status === 'missing') {
    return <StaticBanner type='warning'>Module Manifest file is missing.</StaticBanner>
  }

  const updateConfigField = (field: ModuleConfigField, value: ModuleConfigValue) => {
    onChange(dep => ({config: {...dep.config, [field.fieldName]: value}}))
  }

  const resetConfigField = (field: ModuleConfigField) => {
    onChange((dep) => {
      const newConfig = {...dep.config}
      delete newConfig[field.fieldName]
      return {config: newConfig}
    })
  }

  return (
    <RawModuleConfigEditor
      manifest={manifestState.manifest}
      config={dependency.config}
      onFieldUpdate={updateConfigField}
      onFieldReset={resetConfigField}
    />
  )
}

export {
  SelfHostedModuleConfigEditor,
}
