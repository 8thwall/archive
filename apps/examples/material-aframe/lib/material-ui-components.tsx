// React components built on top of MUI (MaterialUI).
declare var MaterialUI: any
declare var React: any
declare var ReactRouterDOM: any

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

const BrushIcon = (props) => (
  <SvgIcon {...props}>
    {/* See https://materialdesignicons.com/ "brush" */}
    <path d='M20.71,4.63L19.37,3.29C19,2.9 18.35,2.9 17.96,3.29L9,12.25L11.75,15L20.71,6.04C21.1,5.65 21.1,5 20.71,4.63M7,14A3,3 0 0,0 4,17C4,18.31 2.84,19 2,19C2.92,20.22 4.5,21 6,21A4,4 0 0,0 10,17A3,3 0 0,0 7,14Z' />
  </SvgIcon>
)

const fabStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 2,
  },
}))

const FloatingButton = ({onClick}) => {
  const classes = fabStyles()
  return (
    <Fab
      className={classes.fab}
      color='secondary'
      onClick={onClick}
    >
      <BrushIcon fontSize='inherit' />
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
      disableRipple: true,
    },
  },
})

const MaterialUIApp = (props) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {props.children}
  </ThemeProvider>
)

export {FloatingButton, MaterialUIApp}
