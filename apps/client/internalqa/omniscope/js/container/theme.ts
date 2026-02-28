import {createMuiTheme} from '@material-ui/core/styles'

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ad50ff',  // 8w highlight
    },
    secondary: {
      main: '#ffc828',  // mango
    },
    error: {
      main: '#dd0065',  // cherry
    },
    background: {
      default: '#f2f1f3',  // eggshell
    },
  },
})

export default theme
