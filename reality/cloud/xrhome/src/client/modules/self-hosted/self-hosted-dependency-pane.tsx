import React from 'react'
import {createUseStyles} from 'react-jss'
import type {DeepReadonly} from 'ts-essentials'

import type {DependencyUpdater} from './self-hosted-reducer'
import type {ModuleDependency} from '../../../shared/module/module-dependency'
import {TargetSelector} from '../../editor/dependency-settings'
import {useChangeEffect} from '../../hooks/use-change-effect'
import {brandWhite, gray3} from '../../static/styles/settings'
import {LinkButton} from '../../ui/components/link-button'
import {SpaceBetween} from '../../ui/layout/space-between'
import AutoHeading from '../../widgets/auto-heading'
import AutoHeadingScope from '../../widgets/auto-heading-scope'
import {SelfHostedModuleConfigEditor} from './self-hosted-config-editor'
import {useAbandonableFunction} from '../../hooks/use-abandonable-function'
import useActions from '../../common/use-actions'
import dependencyActions from '../../editor/dependency-actions'
import {StaticBanner} from '../../ui/components/banner'

const useStyles = createUseStyles({
  managementSection: {
    // TODO(christoph): Get real mocks
    background: brandWhite,
    padding: '1rem',
    marginBottom: '2rem',
    borderRadius: '1rem',
    border: `1px solid ${gray3}`,
  },
})

interface ISelfHostedDependencyPane {
  dependency: DeepReadonly<ModuleDependency>
  onChange: (updater: DependencyUpdater) => void
  onDelete: () => void
}

const SelfHostedDependencyPane: React.FC<ISelfHostedDependencyPane> = ({
  dependency, onChange, onDelete,
}) => {
  const classes = useStyles()
  const {fetchModuleTargets} = useActions(dependencyActions)
  const fetchModuleTargetsAbandonable = useAbandonableFunction(fetchModuleTargets)
  const [failedDependencyId, setFailedDependencyId] = React.useState<string>(null)

  useChangeEffect(([prevDependency]) => {
    if (prevDependency?.dependencyId !== dependency.dependencyId) {
      setFailedDependencyId(null)
      fetchModuleTargetsAbandonable(dependency).catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load targets', err)
        setFailedDependencyId(dependency.dependencyId)
      })
    }
  }, [dependency, fetchModuleTargetsAbandonable] as const)

  if (dependency.dependencyId === failedDependencyId) {
    return <StaticBanner type='danger'>Failed to load targets</StaticBanner>
  }

  return (
    <AutoHeadingScope>
      <section className={classes.managementSection}>
        <SpaceBetween direction='vertical'>
          <AutoHeading>{dependency.alias}</AutoHeading>
          <TargetSelector
            dependency={dependency}
            onChange={newTarget => onChange({target: newTarget})}
          />
          <SelfHostedModuleConfigEditor
            dependency={dependency}
            onChange={updater => onChange(updater)}
          />
          <div>
            <LinkButton onClick={onDelete}>Remove</LinkButton>
          </div>
        </SpaceBetween>
      </section>
    </AutoHeadingScope>
  )
}

export {
  SelfHostedDependencyPane,
}
