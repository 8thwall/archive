import React from 'react'

import {combine} from '../../common/styles'
import type {IBrowseModule} from '../../common/types/models'
import {createThemedStyles} from '../../ui/theme'
import {ModuleImportTile} from './module-import-tile'

interface IModuleImportItem {
  module: IBrowseModule
  onSelect: () => void
}

const useStyles = createThemedStyles(theme => ({
  button: {
    'cursor': 'pointer',
    'background': 'none',
    'color': 'inherit',
    'border': 'none',
    'padding': '0',
    'text-align': 'left',
    'outline': 'inherit',
  },
  moduleImportItem: {
    'border-radius': '.5rem',
    'height': 'fit-content',
    'color': theme.fgMain,
    'border': 'none',
    'display': 'grid',
    'gap': '0.5rem',
    'position': 'relative',
    'grid-template': '"image image" "content icon" / 1fr auto',
  },
  targetSelector: {
    'width': '100%',
    'position': 'relative',
    'border-radius': '.5rem',
    'border': 'none',
    'padding': '4px 8px',
    'font-size': '10px',
    'color': `${theme.fgMain} !important`,
  },
}))

const ModuleImportItem: React.FC<IModuleImportItem> = ({module, onSelect}) => {
  const classes = useStyles()
  const onClick = () => {
    onSelect()
  }
  const id = `moduleSelect#${module.uuid}`
  return (
    <button
      id={id}
      type='button'
      name='module'
      onClick={onClick}
      className={combine(classes.button, classes.moduleImportItem)}
    >
      <ModuleImportTile module={module} />
    </button>
  )
}

export {ModuleImportItem}

export type {IModuleImportItem}
