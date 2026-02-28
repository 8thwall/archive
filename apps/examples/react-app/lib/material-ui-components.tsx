// React components built on top of MUI (MaterialUI).

import {path} from '../lib/routes'

declare let MaterialUI: any
declare let React: any
declare let ReactRouterDOM: any
declare let componentHandler: any

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
} = MaterialUI

const {withRouter, Link} = ReactRouterDOM

const cardStyles = makeStyles({
  card: {
    maxWidth: 360,
  },
  media: {
    height: 189,
  },
})

const NavCard = withRouter((props) => {
  const {title, text, to, img, history} = props
  const classes = cardStyles()

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={() => history.push(to)}>
        <CardMedia
          className={classes.media}
          image={img}
          title={title}
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h2'>
            {title}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            {text}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size='small' color='primary' onClick={() => history.push(to)}>
          Try it
        </Button>
      </CardActions>
    </Card>
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
      color='secondary'
      onClick={() => history.push(path(location, '..'))}
    >
      <ArrowBackIcon fontSize='inherit' />
    </Fab>
  )
})

const gridStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
}))

const OneColumnGrid = (props) => {
  const classes = gridStyles()
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {props.children.map((c, i) => (
          <Grid item xs={12} key={i}>
            {c}
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

const ElevationScroll = (props) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  return React.cloneElement(props.children, {
    elevation: trigger ? 4 : 0,
  })
}

const pageStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

const Page = withRouter((props) => {
  const classes = pageStyles()
  const {history} = props

  return (
    <React.Fragment>
      <ElevationScroll {...props}>
        <AppBar>
          <Toolbar>
            {!props.top && (
              <IconButton
                edge='start'
                className={classes.menuButton}
                color='inherit'
                aria-label='back'
                onClick={() => history.push(path(location, '..'))}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant='h6' className={classes.title}>
              {props.title}
            </Typography>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <Container>
        {props.children}
      </Container>
    </React.Fragment>
  )
})

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

const MaterialUIApp = props => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {props.children}
  </ThemeProvider>
)

export {FloatingBackButton, NavCard, MaterialUIApp, OneColumnGrid, Page}
