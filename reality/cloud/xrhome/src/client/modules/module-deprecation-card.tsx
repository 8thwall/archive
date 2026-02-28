import React from 'react'
import {createUseStyles} from 'react-jss'

import type {DeepReadonly} from 'ts-essentials'

import type {IModule} from '../common/types/models'
import useActions from '../common/use-actions'
import moduleVersionActions from './module-version-actions'
import {useSelector} from '../hooks'
import {
  getVersionSpecifier, hasDeprecatedPatchAbove,
} from '../../shared/module/module-version-patches'
import Accordion from '../widgets/accordion'
import {
  brandBlack, cherry, eggshell, gray1, gray2, gray3, gray4, moonlight,
} from '../static/styles/settings'
import {compareVersionInfo} from '../../shared/module/compare-module-target'
import type {VersionInfo} from '../../shared/module/module-target-api'
import {Loader} from '../ui/components/loader'

interface IModuleDeprecationContents {
  active: boolean
  module: IModule
}

const useStyles = createUseStyles({
  'button': {
    'color': cherry,
    'fontFamily': 'inherit',
    'size': '12px',
    'border': 0,
    'background': 'transparent',
    'cursor': 'pointer',
  },
  'table': {
    'border': `1px solid ${gray3}`,
    'borderSpacing': '0',
    'width': '100%',
    'borderRadius': '0.5rem',
    'tableLayout': 'fixed',
    'overflow': 'hidden',
    '& td': {
      textAlign: 'left',
      padding: '1rem 1.5rem',
      borderBottom: `1px solid ${gray2}`,
    },
    '& tr:last-child td': {
      border: '0',
    },
    '& th': {
      textAlign: 'left',
      fontWeight: 'normal',
      padding: '0.5rem 1.5rem',
      borderBottom: `1px solid ${gray2}`,
    },
    '& td:first-child': {
      fontWeight: 'bold',
    },
    '& td:nth-child(2)': {
      color: gray4,
      fontStyle: 'italic',
      fontWeight: '400',
    },
    '& td:last-child': {
      textAlign: 'right',
    },
  },
  'disabledRow': {
    '& td': {
      background: eggshell,
    },
    '& td:first-child': {
      fontWeight: 'normal',
      color: gray3,
    },
    '& td:nth-child(2)': {
      color: gray1,
    },
    '& button': {
      color: brandBlack,
    },
  },
  'header': {
    textAlign: 'left',
    borderBottom: `1px solid ${gray2}`,
    background: moonlight,
  },
})

const ModuleDeprecationContents = ({active, module}) => {
  const classes = useStyles()
  const {fetchModuleVersions, patchModuleVersion} = useActions(moduleVersionActions)

  const patches: DeepReadonly<VersionInfo[]> = useSelector(
    s => s.modules.versions[module.uuid]?.patchData
  )

  React.useEffect(() => {
    fetchModuleVersions(module.uuid)
  }, [active, module.uuid])

  if (!patches) {
    return <Loader inline />
  }

  if (!patches.length) {
    return <div>There are no available module versions to deprecate.</div>
  }

  const sortedPatches = [...patches].sort(compareVersionInfo)

  return (
    <table className={classes.table}>
      <thead className={classes.header}>
        <tr>
          <th>Version</th>
          <th>Last Update</th>
          <th aria-label='Deprecate' />
        </tr>
      </thead>
      <tbody>
        {sortedPatches.map((p, i) => {
          const text = getVersionSpecifier(p.patchTarget)
          const isDisabled = hasDeprecatedPatchAbove(sortedPatches, p.patchTarget)
          return (
            <tr className={p.deprecated ? classes.disabledRow : ''} key={text}>
              <td>{text}</td>
              <td>
                {`${new Date(p.publishTime).toLocaleDateString()}
                ${isDisabled ? '(Implicitly deprecated)' : ''}`}
              </td>
              <td>
                {i !== 0 &&
                  <button
                    className={classes.button}
                    type='button'
                    onClick={() => patchModuleVersion(
                      module.uuid, p.patchTarget, {deprecated: !p.deprecated}
                    )}
                  >
                    {p.deprecated ? 'Enable' : 'Disable'}
                  </button>
                  }
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

interface IModuleDeprecationCard extends IModuleDeprecationContents {
  active: boolean
  onTitleClick: () => void
}

const ModuleDeprecationCard: React.FC<IModuleDeprecationCard> = ({
  active, onTitleClick, ...rest
}) => (
  <Accordion>
    <Accordion.Title
      active={active}
      onClick={onTitleClick}
    >
      Deprecate This Module
    </Accordion.Title>
    {active &&
      <Accordion.Content>
        <ModuleDeprecationContents {...rest} active={active} />
      </Accordion.Content>
    }
  </Accordion>
)

export {
  ModuleDeprecationCard,
}
