import {RoverView} from './rover'

declare let React: any
declare let ReactDOM: any
declare let ReactRouterDOM: any

const {BrowserRouter, Route, Redirect} = ReactRouterDOM

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Route path='/' component={RoverView} />
      </BrowserRouter>
    )
  }
}

const render = () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  )
}

export {render}
