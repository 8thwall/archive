import React from 'react'

import LinkOut from '../../uiWidgets/link-out'
import {useSelector} from '../../hooks'
import {useUiTheme, type UiTheme} from '../../ui/theme'
import {createCustomUseStyles} from '../../common/create-custom-use-styles'

interface ThemeProps {
  resultsRendered: boolean
  theme: UiTheme
}

const useStyles = createCustomUseStyles<ThemeProps>()(() => ({
  searchEntryDropdown: {
    'zIndex': 100,
    'position': 'absolute',
    'backgroundColor': ({theme}) => theme.sfcBackgroundDefault,
    'margin': 0,
    'width': '100%',
    'maxHeight': '9em',
    'display': 'flex',
    'flexDirection': 'column',
    'overflowX': 'hidden',
    'overflowY': 'scroll',
    'border': ({theme}) => theme.studioBgBorder,
    'borderWidth': ({resultsRendered}) => (resultsRendered ? '0 1px 1px 1px' : '0'),
    'borderRadius': '0 0 0.25em 0.25em',

    '&::-webkit-scrollbar-thumb': {
      'background': ({theme}) => theme.scrollbarThumbColor,
      'borderRadius': '0.25em',
      '&:hover': {
        background: ({theme}) => theme.scrollbarThumbHoverColor,
      },
    },
    '&::-webkit-scrollbar-track': {
      background: ({theme}) => theme.scrollbarTrackBackground,
      borderRadius: '0.25em',
    },
  },
  searchEntry: {
    'color': ({theme}) => theme.fgMuted,
    'padding': '0.75em 0.5em',
    'fontSize': '12px',
    'display': 'flex',
    'alignItems': 'center',
    'overflow': 'hidden',
    'whiteSpace': 'nowrap',
    'textOverflow': 'ellipsis',

    '&:hover': {
      color: ({theme}) => theme.fgMain,
      backgroundColor: ({theme}) => theme.studioBtnHoverBg,
    },
  },
}))

const SearchEntryDropDown: React.FC = () => {
  const dropdownEntries = useSelector(state => state.helpCenter.searchResults)
  const resultsRendered = !!dropdownEntries.length
  const theme = useUiTheme()
  const classes = useStyles({resultsRendered, theme})

  return (
    <div className={classes.searchEntryDropdown}>
      {!!dropdownEntries.length && (
        <div>
          {dropdownEntries.map(({linkText, url, id}) => (
            <LinkOut
              className={classes.searchEntry}
              key={id}
              url={url}
            >
              <div title={linkText}>{linkText}</div>
            </LinkOut>
          ))}
        </div>
      )}
    </div>
  )
}

export {
  SearchEntryDropDown,
}
