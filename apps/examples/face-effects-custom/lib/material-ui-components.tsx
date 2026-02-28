// React components built on top of MUI (MaterialUI).
declare let MaterialUI: any
declare let React: any
declare let ReactRouterDOM: any

const {
  AppBar,
  Button,
  CssBaseline,
  Fab,
  IconButton,
  SvgIcon,
  ThemeProvider,
  colors,
  createMuiTheme,
  makeStyles,
} = MaterialUI

const {withRouter, Link} = ReactRouterDOM

const BrushIcon = props => (
  <SvgIcon {...props}>
    {/* See https://materialdesignicons.com/ "arrow-right-circle" */}
    <path d='M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M6,13H14L10.5,16.5L11.92,17.92L17.84,12L11.92,6.08L10.5,7.5L14,11H6V13Z' />
  </SvgIcon>
)

const fabStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 2,
  },
  iconRightOfText: {
    marginLeft: '0.75em',
  },
}))

const FloatingButton = ({onClick, description}) => {
  const classes = fabStyles()
  return (
    <Fab
      className={classes.fab}
      color='secondary'
      variant='extended'
      onClick={onClick}
    >
      {description}
      <BrushIcon fontSize='inherit' className={classes.iconRightOfText}/>
    </Fab>
  )
}

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#464766',
    },
    secondary: {
      main: '#AD50FF',
    },
    error: {
      main: colors.red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: [
      'Nunito',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  props: {
    // Ripple causes flaky button press issues on iOS 13; disable it.
    // https://github.com/google/material-design-lite/issues/5281
    MuiButtonBase: {
      disableRipple: false,
    },
  },
})

const MaterialUIApp = props => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {props.children}
  </ThemeProvider>
)

export {FloatingButton, MaterialUIApp}
