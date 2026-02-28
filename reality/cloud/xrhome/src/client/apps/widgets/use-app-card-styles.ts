import {
  cardShadowBlur,
  cardShadowSpread,
  gray4,
} from '../../static/styles/settings'
import {createThemedStyles} from '../../ui/theme'

/* eslint-disable max-len */
const useAppCardStyles = createThemedStyles(theme => ({
  'appCard': {
    'borderRadius': '0.56em',
    'WebkitBoxShadow': `2px 2px ${cardShadowBlur} ${cardShadowSpread} ${theme.appCardShadowColor} !important`,
    'boxShadow': `2px 2px ${cardShadowBlur} ${cardShadowSpread} ${theme.appCardShadowColor} !important`,
    'background-color': `${theme.appCardBgColor} !important`,
    'border': `${theme.appCardBorder} !important`,
    '&.disabled': {
      'boxShadow': 'none !important',
      'border': `${theme.appCardDisabledBorder} !important`,
    },
    '& .content': {
      'boxSizing': 'border-box',
      'lineHeight': '1.4285em',
      'minHeight': '1.4285em',
      '& .ui.dropdown': {
        'float': 'right',
        '&.top.right.pointing > .menu': {
          'top': 'calc(100% - 1.25em)',
          'right': '0.25em',
        },
      },
      '& > $header': {
        'whiteSpace': 'nowrap',
        'display': 'flex !important',
        'flexDirection': 'row',
        'fontWeight': 'bold',
        'color': `${theme.fgMain} !important`,
        'alignItems': 'center',
      },
    },
    '& .header-content': {
      'display': 'flex',
      'flexDirection': 'column',
      'justifyContent': 'center',
      'flexGrow': '0 !important',
      'padding': '0 !important',
      '& .left, & .right.dropdown': {
        'padding': '1rem',
      },
    },
    '& .footer-content': {
      'flexGrow': '0 !important',
      'display': 'flex',
      'alignItems': 'center',
      'flexDirection': 'row',
      'fontSize': '0.9em',
      '& .left': {
        'marginRight': '1em',
        'userSelect': 'text',
      },
    },
    '& .left': {
      'flex': '1 1',
      'minHeight': '1.4285em',
      '& .account-name': {
        'fontWeight': 'bold',
        'verticalAlign': 'middle',
      },
    },
    '& .right': {
      'flex': '1 1',
      'textAlign': 'right',
      'minHeight': '1.4285em',
      '& .dropdown:hover': {
        'color': gray4,
      },
      '&:not(:first-child)': {
        'flex': '0 0 auto',
      },
    },
    '.archived &': {
      'boxShadow': 'none !important',
      'border': `${theme.appCardDisabledBorder} !important`,
      '& .content': {
        '& $header > a, & $header .left': {
          'color': theme.fgDisabled,
        },
      },
    },
  },
  'header': {
    fontFamily: `${theme.appCardHeaderFontFamily} !important`,
  },
}))
/* eslint-enable max-len */

export {
  useAppCardStyles,
}
