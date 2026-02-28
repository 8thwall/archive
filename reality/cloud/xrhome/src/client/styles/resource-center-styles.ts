import {createThemedStyles} from '../ui/theme'

const useResourceCenterStyles = createThemedStyles(theme => ({
  pendoContainer: {
    position: 'relative',
  },
  sideBarPosition: {
    left: '20px !important',
  },
  regularPosition: {
    left: '24px !important',
  },
  pendoResourceCenter: {
    'backgroundColor': `${theme.studioBgOpaque} !important`,
    'border': theme.studioSectionBorder,
    '& ._pendo-resource-center-home-title-text': {
      display: 'none !important',
    },
    '& #pendo-resource-center-module-title-container': {
      '& h2': {
        color: theme.fgMain,
      },
      '& ._pendo-resource-center-left-caret::before': {
        borderRightColor: `${theme.fgMuted} !important`,
      },
      '& ._pendo-resource-center-left-caret::after': {
        borderRightColor: `${theme.studioBgOpaque} !important`,
      },
      '& ._pendo-resource-center-left-caret:hover::before': {
        borderRightColor: `${theme.fgMain} !important`,
      },
    },
    '& ._pendo-text-list-ordered': {
      'border': `${theme.studioSectionBorder} !important`,
      'borderWidth': '1px 0 0 0 !important',
      '& ._pendo-step-container-styles': {
        'background': `${theme.sfcBackgroundDefault} !important`,
        'border': `${theme.studioBgBorder} !important`,
        'padding': '0.75em !important',
        'margin-bottom': '0.5em !important',
        '& ._pendo-text-paragraph': {
          'color': `${theme.fgMain} !important`,
        },
        '& a': {
          color: theme.fgPrimary,
          textDecoration: 'none !important',
        },
      },
      '& ._pendo-text-list-item': {
        'padding': '0 0 0 0 !important',
        'borderRadius': '0.25em',
      },
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: theme.scrollbarTrackBackground,
        borderRadius: '6px',
      },
      '&::-webkit-scrollbar-thumb': {
        'backgroundColor': theme.scrollbarThumbColor,
        '&:hover': {
          backgroundColor: theme.scrollbarThumbHoverColor,
        },
      },
    },
    '& ._pendo-resource-center-module-list-item-text-container > ._pendo-simple-text': {
      color: theme.fgMain,
    },
    '& ._pendo-resource-center-module-list-item-style': {
      'padding': '0.45em 0.5em !important',
      '&:first-of-type': {
        marginTop: '0.5em',
      },
      '& ._pendo-resource-center-module-list-item-title-text': {
        'color': `${theme.fgMain} !important`,
        'fontSize': '12px !important',
      },
      '& ._pendo-resource-center-module-list-item-subtitle-text': {
        display: 'none',
      },
      '& .pendo-mock-flexbox-row': {
        display: 'flex !important',
        alignItems: 'center',
      },
    },
    '& ._pendo-resource-center-module-list-item:first-of-type': {
      marginTop: '0.5em',
    },
    '& ._pendo-resource-center-module-list-item:hover': {
      'backgroundColor': `${theme.studioBtnHoverBg}`,
    },
    '& #pendo-resource-center-module-title-container > h2': {
      color: `${theme.fgMain} !important`,
      fontSize: '14px !important',
      padding: '0.5em !important',
    },
    '& ._pendo-text-plain': {
      fontSize: '12px !important',
    },
    '& #pendo-module-body-container': {
      'border': `${theme.studioSectionBorder} !important`,
      '& ._pendo-text-list-ordered': {
        borderWidth: '0 !important',
        padding: '1em 0 !important',
      },
      '& ._pendo-resource-center-guidelist-module-listed-guide': {
        'listStyleType': 'circle !important',
        'marginBottom': '0.75em !important',
        '&::marker': {
          color: theme.fgMain,
        },
      },
      '& button:hover': {
        textDecoration: 'none !important',
      },
      '& ._pendo-simple-text': {
        'color': `${theme.fgPrimary} !important`,
        'fontSize': '12px !important',
        '&:hover': {
          color: `${theme.fgBlue} !important`,
        },
      },
    },
    '& ._pendo-resource-center-close-button': {
      display: 'none !important',
    },
    '& ._pendo-resource-center-onboarding-module-list': {
      'padding': '1em !important',
      '& ._pendo-text-list-item': {
        marginBottom: '0.75em',
      },
      '& ._pendo-resource-center-onboarding-module-listed-guide-text': {
        'color': `${theme.fgPrimary} !important`,
        'fontSize': '14px !important',
      },
      '& ._pendo-resource-center-onboarding-module-listed-guide-step-complete': {
        'color': `${theme.fgMuted} !important`,
        'fontSize': '12px !important',
      },
      '& button': {
        'padding': '0 !important',
        '&:hover': {
          'textDecoration': 'none !important',
          '& ._pendo-resource-center-onboarding-module-listed-guide-text': {
            color: `${theme.fgBlue} !important`,
          },
        },
      },
    },
    '& ._pendo-resource-center-onboarding-module-progress-bar': {
      'height': 'unset !important',
      'border': `${theme.studioSectionBorder} !important`,
      '& ._pendo-resource-center-onboarding-module-percent-complete': {
        'color': `${theme.fgMuted} !important`,
        'fontSize': '12px !important',
        'marginTop': '0.5em !important',
      },
    },
  },
}))

export default useResourceCenterStyles
