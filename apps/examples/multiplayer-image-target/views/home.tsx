import {Page} from '../lib/material-ui-components'
import {path} from '../lib/routes'

declare let MaterialUI: any
const {makeStyles, Button} = MaterialUI

declare let React: any
declare let ReactRouterDOM: any
const {Link, useLocation} = ReactRouterDOM

const gray5 = '#464766'
const brandPurple = '#7611b6'

const useStyles = makeStyles(theme => ({
  box: {
    'borderRadius': '0.5em',
    'border': '1px solid #333',
    '& + &': {
      marginTop: '1em',
    },
  },
  input: {
    marginBottom: '1em',
    width: '90%',
    padding: '0.75em',
    textAlign: 'center',
    borderRadius: '0.25em',
    border: '1px solid #333',
    backgroundColor: gray5,
    color: '#fff',
  },
  button: {
    width: '90%',
    padding: '0.5em',
    borderRadius: '0.25em',
    border: '1px solid #333',
    margin: '0 1em 1em 1em',
  },
  primary: {
    backgroundColor: brandPurple,
    color: '#fff',
  },
  page: {
    marginTop: '10em',
  },
}))

const Home = ({}) => {
  const [gameCode, setGameCode] = React.useState('')

  const classes = useStyles()
  const location = useLocation()
  return (
    <Page className={`centered ${classes.page}`} title='Multiplayer with 8th Wall' top={true}>
      <h1>Shared AR</h1>
      <p>
        Welcome to the Shared AR for Web Private Beta!
      </p>
      <div className={classes.box}>
        <h2>Join a game</h2>
        <input className={classes.input} value={gameCode} onInput={e => setGameCode(e.target.value)} placeholder='Enter a game code' />
        <Button component={Link} to={{pathname: path(location, 'room'), search: `?roomId=${gameCode}`}} className={`${classes.button} ${classes.primary}`} primary>
          Join Game
        </Button>
      </div>
      <div className={classes.box}>
        <h2>Start a new game</h2>

        <Button component={Link} to={path(location, 'room')} className={`${classes.button} ${classes.primary}`} primary>
          New Game
        </Button>
      </div>
    </Page>
  )
}

export {Home}
