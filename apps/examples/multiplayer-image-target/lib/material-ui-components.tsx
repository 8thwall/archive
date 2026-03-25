// React components built on top of MUI (MaterialUI).
import {path} from '../lib/routes'
declare let MaterialUI: any
declare let React: any
declare let ReactRouterDOM: any
const {
  Container,
  CssBaseline,
  Grid,
  IconButton,
  ThemeProvider,
  colors,
  createMuiTheme,
  makeStyles,
  useScrollTrigger,
} = MaterialUI
const {withRouter, Link} = ReactRouterDOM

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
  return (
    <Container className={props.className}>
      {props.children}
    </Container>
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

export {MaterialUIApp, OneColumnGrid, Page}
