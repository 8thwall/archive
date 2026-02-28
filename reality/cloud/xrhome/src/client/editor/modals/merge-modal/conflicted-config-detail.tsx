import React from 'react'
import type {DeepReadonly} from 'ts-essentials'

import type {DependencyConflictDetails} from '../../dependency-conflicts'
import type {ModuleConfigValue} from '../../../../shared/module/module-dependency'
import {moduleConfigValueOrSymbolEqual} from '../../../../shared/module/compare-module-config-value'
import {ConflictDisplay} from './conflict-display'

const ConfigValueDisplay: React.FC<{value: ModuleConfigValue}> = ({value}) => {
  if (value === undefined) {
    return <em>reset to default</em>
  }

  // TODO(pawel) Need specific view for URL and Assets configs.
  return (
    <div>{JSON.stringify(value)}</div>
  )
}

interface IConflictedConfigDetail {
  details: DeepReadonly<DependencyConflictDetails>
  configName: string  // the particular config value we are interested in
  resolveValueConflict: (configName: string, value: ModuleConfigValue) => void
}

const ConflictedConfigDetail: React.FC<IConflictedConfigDetail> = ({
  details,
  configName,
  resolveValueConflict,
}) => {
  const configValueDetail = details.conflictedConfigEntries[configName]
  const mySelected = moduleConfigValueOrSymbolEqual(
    configValueDetail.resolution,
    configValueDetail.mine
  )
  const theirSelected = moduleConfigValueOrSymbolEqual(
    configValueDetail.resolution,
    configValueDetail.theirs
  )

  return (
    <ConflictDisplay
      baseButtonId={`config-merge-${configName}`}
      title={configName}
      leftChecked={mySelected}
      rightChecked={theirSelected}
      onSelectLeft={() => resolveValueConflict(configName, configValueDetail.mine)}
      onSelectRight={() => resolveValueConflict(configName, configValueDetail.theirs)}
      left={<ConfigValueDisplay value={configValueDetail.mine} />}
      right={<ConfigValueDisplay value={configValueDetail.theirs} />}
    />
  )
}

export {
  ConflictedConfigDetail,
}
