declare let React: any
declare let ReactRouterDOM: any

const {withRouter} = ReactRouterDOM

// Renders 404 message for any unknown route.
const NotFound = withRouter(() => (
  <React.Fragment>
    <h1>404</h1>
    <h2>Not Found</h2>
  </React.Fragment>
))

export {NotFound}
