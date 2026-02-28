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

const cardStyles = makeStyles(theme => ({
  'container': {

  },
  'media': {
    'width': '100%',
    'cursor': 'pointer',
  },
}))

const NavCard = withRouter((props) => {
  const {title, text, to, img, history, color} = props
  const classes = cardStyles(props)

  return (
    <Box className={classes.container}>
      <img className={classes.media} src={img} onClick={() => history.push(to)} />
    </Box>
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

const gridStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  responsive: {
    background: '#000',
  },
  grid: {
    padding: 50,
    flexGrow: 1,
  },
  item: {
    padding: 15,
    marginBottom: -6,
  },
}))

const ResponsiveGrid = (props) => {
  const classes = gridStyles()
  return (
    <div className={classes.responsive}>
      <Grid container className={classes.grid}>
        {props.children.map((c, i) => (
          <Grid item xs={12} lg={4} key={i} className={classes.item}>
            {c}
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

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

export {FloatingBackButton, NavCard, MaterialUIApp, ResponsiveGrid, Page}
