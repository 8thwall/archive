// React components built on top of MUI (MaterialUI).
import {COLORS} from './colors'
import {path} from './routes'

declare let MaterialUI: any
declare let React: any
declare let ReactRouterDOM: any

const {
  AppBar,
  Button,
  Card,
  CardContent,
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

const colorPickerClasses = {
  card: {backgroundColor: '#D9D0E3'},
  nounderline: {textDecoration: 'none'},
}
Object.keys(COLORS).forEach((color) => {
  colorPickerClasses[color] = {backgroundColor: COLORS[color]}
})

const colorPickerStyles = makeStyles(colorPickerClasses)

const ColorPicker = withRouter((props) => {
  const classes = colorPickerStyles()
  return (
    <Card className={classes.card}>
      <CardContent>
        <Grid container spacing={3} direction='row' justify='center' alignItems='center'>
          {Object.keys(COLORS).map(
            color => (
              <Grid item xs={4} key={color} justify='center'>
                <Link to={path(location, color)} className={classes.nounderline}>
                  <Button variant='contained' className={classes[color]} size='large'>&nbsp;</Button>
                </Link>
              </Grid>
            )
          )
          }
        </Grid>
      </CardContent>
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
  const {history, location} = props

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

export {ColorPicker, FloatingBackButton, MaterialUIApp, Page}
