import React from 'react'
import {useTranslation} from 'react-i18next'

import {bodySanSerif, gray3} from '../../static/styles/settings'
import {useSelector} from '../../hooks'
import {createCustomUseStyles} from '../../common/create-custom-use-styles'
import {Icon} from '../../ui/components/icon'
import {useUiTheme, type UiTheme} from '../../ui/theme'

interface themeProps {
  resultsRendered: boolean
  theme: UiTheme
}

const useStyles = createCustomUseStyles<themeProps>()(() => ({
  'searchContainer': {
    'display': 'flex',
    'flex': '1',
    'flexDirection': 'row',
    'height': '32px',
    'border': ({theme}) => theme.studioBgBorder,
    'borderWidth': ({resultsRendered}) => (resultsRendered ? '1px 1px 0 1px' : '1px'),
    'borderRadius': ({resultsRendered}) => (resultsRendered ? '0.25em 0.25em 0 0' : '0.25em'),
    'backgroundColor': ({theme}) => theme.sfcBackgroundDefault,
    'position': 'relative',
    'padding': '0.25rem 0',
    'fontSize': '12px',
  },
  'searchIcon': {
    color: gray3,
    display: 'flex',
    alignItems: 'center',
    padding: '0.25em 0.5em',
    position: 'absolute',
    left: 0,
    pointerEvents: 'none',
  },
  'searchInput': {
    'paddingLeft': '2.25em',
    'width': '100%',
    'padding': '0',
    'border': '0',
    'outline': '0',
    'backgroundColor': 'transparent',
    'fontFamily': bodySanSerif,
    'color': ({theme}) => theme.fgMain,
    '&::placeholder': {
      color: ({theme}) => theme.fgMuted,
    },
    '$:-ms-input-placeholder': {
      color: ({theme}) => theme.fgMuted,
    },
    '::-ms-input-placeholder': {
      color: ({theme}) => theme.fgMuted,
    },
    '&:focus::placeholder': {
      color: 'transparent',
    },
  },
}))

interface IHelpCenterSearch {
  setSearchQuery: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const HelpCenterSearchInput: React.FC<IHelpCenterSearch> = (
  {setSearchQuery, placeholder = ''}
) => {
  const {t} = useTranslation(['app-pages'])
  const dropdownEntries = useSelector(state => state.helpCenter.searchResults)
  const resultsRendered = !!dropdownEntries.length
  const theme = useUiTheme()
  const classes = useStyles({resultsRendered, theme})

  return (
    <div className={classes.searchContainer}>
      <div className={classes.searchIcon}>
        <Icon stroke='search' />
      </div>
      <input
        className={classes.searchInput}
        type='search'
        placeholder={placeholder}
        aria-label={t('in_app_help_center.search_input.alt_text.search')}
        onChange={setSearchQuery}
      />
    </div>
  )
}

export {
  HelpCenterSearchInput,
}
