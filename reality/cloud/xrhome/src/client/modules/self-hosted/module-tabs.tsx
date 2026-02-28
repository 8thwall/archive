import React from 'react'
import {createUseStyles} from 'react-jss'

import {combine} from '../../common/styles'
import {brandWhite, gray4, gray5} from '../../static/styles/settings'
import {useDependencyContext} from '../../editor/dependency-context'
import {timeSince} from '../../common/time-since'
import type {LastUserEdit, LastUserEdits} from './self-hosted-reducer'
import RecencyIndicator from '../../editor/recency-indicator'
import {getOrderedDependencies} from './dependency-order'

const useStyles = createUseStyles({
  moduleTabs: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  moduleTab: {
    cursor: 'pointer',
    borderRadius: '6px',
    padding: '7px 16px',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    display: 'inline-flex',
    alignItems: 'center',
  },
  inactive: {
    boxShadow: `0 0 0 1px inset ${gray4}`,
  },
  active: {
    color: brandWhite,
    background: gray5,
  },
})

interface IModuleTab {
  active: boolean
  dependencyId: string
  onClick: () => void
  lastUserEdit?: LastUserEdit
}

const ModuleTab: React.FC<IModuleTab> = ({active, dependencyId, onClick, lastUserEdit}) => {
  const classes = useStyles()

  const dependencyContext = useDependencyContext()

  const path = dependencyContext.dependencyIdToPath[dependencyId]
  const dependency = dependencyContext.dependenciesByPath[path]
  const name = dependency?.alias || 'Module'

  return (
    <button
      type='button'
      className={combine(
        'style-reset', classes.moduleTab, active ? classes.active : classes.inactive
      )}
      aria-pressed={active}
      onClick={onClick}
    >
      <RecencyIndicator
        color='mango'
        lastLogTime={lastUserEdit?.timestamp ?? 0}
        title={lastUserEdit &&
          `Last modified by ${lastUserEdit.userName} ${timeSince(lastUserEdit.timestamp)} ago`
        }
      />
      {name}
    </button>
  )
}

interface IModuleTabs {
  visibleDependencyId: string
  onSelect: (dependencyId: string) => void
  lastUserEdits: LastUserEdits
}

const ModuleTabs: React.FC<IModuleTabs> = ({visibleDependencyId, onSelect, lastUserEdits}) => {
  const dependencyContext = useDependencyContext()
  return (
    <div className={useStyles().moduleTabs}>
      {getOrderedDependencies(dependencyContext.dependenciesByPath).map(({dependencyId}) => (
        <ModuleTab
          key={dependencyId}
          active={dependencyId === visibleDependencyId}
          dependencyId={dependencyId}
          lastUserEdit={lastUserEdits[dependencyId]}
          onClick={() => {
            onSelect(dependencyId)
          }}
        />
      ))}
    </div>
  )
}

export {
  ModuleTabs,
}

export type {
  LastUserEdit,
  LastUserEdits,
}
