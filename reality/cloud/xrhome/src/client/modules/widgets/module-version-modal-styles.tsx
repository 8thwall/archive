import {tinyViewOverride} from '../../static/styles/settings'
import {createThemedStyles} from '../../ui/theme'

const useStyles = createThemedStyles(theme => ({
  columnFlex: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  note: {
    color: theme.fgMuted,
  },
  formGroup: {
    width: '100%',
    display: 'grid',
    columnGap: '1rem',
    gridAutoColumns: '1fr',
    gridAutoFlow: 'column',
    padding: '1rem 0rem',
    [tinyViewOverride]: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
  },
  required: {
    'fontWeight': '700',
    '&::after': {
      content: '"*"',
      color: theme.inputRequired,
    },
  },
  versionText: {
    color: theme.fgBlue,
  },
  headerPadding: {
    padding: '1rem',
  },
  placeholder: {
    '& .ui.placeholder': {
      'backgroundColor': `${theme.modalBg} !important`,
    },
    '& .ui.placeholder .line': {
      'backgroundColor': theme.modalContentBg,
    },
  },
  titlePlaceholder: {
    height: '38px',
    borderRadius: '4px',
  },
  releasePlaceholder: {
    height: '194px',
    borderRadius: '4px',
  },
  submitPlaceholder: {
    width: '88px',
    height: '38px',
    borderRadius: '6px',
    backgroundColor: `${theme.primaryBtnDisabledBg} !important`,
  },
}))

export {
  useStyles as useModuleVersionModalStyles,
}
