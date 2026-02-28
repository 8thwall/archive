import React from 'react'

import {StandardDropdownField} from '../../ui/components/standard-dropdown-field'
import {ModuleCommitOption} from './module-commit-option'
import {useModuleCommitTarget} from '../../hooks/use-module-commit-target'
import type {IDeployableModule} from '../../common/types/models'
import {useModuleVersionModalStyles} from './module-version-modal-styles'
import {comparePatchVersions} from '../../../shared/module/compare-module-target'
import {useSelector} from '../../hooks'

interface IModuleCommitDropdown {
  module: IDeployableModule
  value: string
  onChange: (newValue: string) => void
}

const ModuleCommitDropdown: React.FC<IModuleCommitDropdown> = ({module, value, onChange}) => {
  const classes = useModuleVersionModalStyles()
  const history = useSelector(s => s.modules.history[module.uuid])
  const commitPatches = useModuleCommitTarget(module)

  const options = history.map((c, i) => ({
    content: (
      <ModuleCommitOption
        buildInfo={c}
        first={i === 0}
        selected={c.commitId === value}
        targets={commitPatches?.[c.commitId]?.sort(comparePatchVersions)}
      />
    ),
    value: c.commitId,
  }))

  return (
    <StandardDropdownField
      id='commit-input'
      options={options}
      height='auto'
      value={value}
      label={<span className={classes.required}>Commit</span>}
      onChange={onChange}
    />
  )
}

export {
  ModuleCommitDropdown,
}
