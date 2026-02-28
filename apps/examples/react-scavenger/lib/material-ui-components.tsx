// React components built on top of MUI (MaterialUI).

import {path} from '../lib/routes'

declare let MaterialUI: any
declare let React: any
declare let ReactRouterDOM: any

const {
  AppBar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Fab,
  Grid,
  IconButton,
  SvgIcon,
  ThemeProvider,
  Toolbar,
  Typography,
  colors,
  createMuiTheme,
  makeStyles,
  useScrollTrigger,
  Box,
} = MaterialUI

const {withRouter, Link} = ReactRouterDOM

const starARStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    top: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px',
    zIndex: 1000,
    fontFamily: 'Helvetica, sans-serif',
    background: 'rgb(0, 122, 255)',
    color: 'white',
    borderRadius: '20px',
  },
}))

const StartARButton = withRouter((props) => {
  const {to, history, buttonText} = props
  const classes = starARStyles(props)
  return (
    <Button className={classes.fab} variant='contained' onClick={() => history.push(to)}>{buttonText}</Button>
  // <Box className={classes.container}>
  //   <button onClick={() => history.push(to)}>start ar</button>
  // </Box>
  )
})

const ArrowBackIcon = props => (
  <SvgIcon {...props}>
    {/* See https://unpkg.com/browse/@material-ui/icons@latest/ArrowBack.js */}
    <path d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z' />
  </SvgIcon>
)

const fabStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: 1000,
  },
}))

const FloatingBackButton = withRouter(({history}) => {
  const classes = fabStyles()
  return (
    <Fab
      className={classes.fab}
      color='#fff'
      onClick={() => {
        history.push(path(location, '..'))
      }}
    >
      <ArrowBackIcon fontSize='inherit' />
    </Fab>
  )
})

const Page = withRouter(props => (
  <React.Fragment>
    {props.children}
  </React.Fragment>
))

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#464766',
    },
    secondary: {
      main: 'rgba(255, 255, 255, 0.5)',
    },
    error: {
      main: colors.red.A400,
    },
    background: {
      default: '#FFFFFF',
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

const MaterialUIApp = props => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {props.children}
  </ThemeProvider>
)

export {StartARButton, FloatingBackButton, MaterialUIApp, Page}
