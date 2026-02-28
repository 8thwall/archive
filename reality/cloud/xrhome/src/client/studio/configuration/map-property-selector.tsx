import React from 'react'
import {useTranslation} from 'react-i18next'
import type {MapTheme} from '@ecs/shared/scene-graph'

import {useStudioMenuStyles} from '../ui/studio-menu-styles'
import {createThemedStyles} from '../../ui/theme'
import {combine} from '../../common/styles'
import {useStyles as useRowFieldStyles} from './row-fields'
import {Icon} from '../../ui/components/icon'
import {SubMenuSelectWithSearch} from '../ui/submenu-select-with-search'
import {ALL_MAP_CATEGORIES} from './map-property-strings'

const useStyles = createThemedStyles(theme => ({
  button: {
    display: 'flex',
    gap: '1em',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  placeholder: {
    color: theme.fgMuted,
    fontStyle: 'italic',
  },
}))

interface IMapPropertySelector {
  onSelect: (property: string) => void
  theme: Partial<MapTheme>
}

const MapPropertySelector: React.FC<IMapPropertySelector> = ({onSelect, theme}) => {
  const {t} = useTranslation(['cloud-studio-pages', 'common'])
  const classes = useStyles()
  const studioClasses = useStudioMenuStyles()
  const rowFieldStyles = useRowFieldStyles()
  const filteredOptions = ALL_MAP_CATEGORIES
    .map(({value, parent, options}) => ({
      value,
      parent,
      options: options.filter(option => theme[option.value] === undefined),
    }))

  return (
    <SubMenuSelectWithSearch
      trigger={(
        <div className={classes.button}>
          <button
            className={combine('style-reset', rowFieldStyles.select, classes.button)}
            type='button'
          >
            <div className={classes.placeholder}>
              {t('map_configurator.property_selector.placeholder')}
            </div>
            <div className={studioClasses.chevronIcon}>
              <Icon block color='gray4' stroke='chevronDown' />
            </div>
          </button>
        </div>
      )}
      onChange={newValue => onSelect(newValue)}
      categories={filteredOptions}
    />
  )
}

export {
  MapPropertySelector,
}
