import {NavCard, ResponsiveGrid, Page} from '../lib/material-ui-components'
import {PwaInstallPrompt} from '../lib/pwa-install-prompt'
import {path} from '../lib/routes'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter} = ReactRouterDOM

const Home = withRouter(({location}) => (
  <Page top={true}>
    <ResponsiveGrid>
      {[...Array(18)].map((x, i) => {
        let navcard
        if (i % 2 === 0) {
          navcard = (
            <NavCard
            key={i}
            title='Glass'
            color='#FD7A3B'
            to={path(location, 'glass')}
            text={'Glass effect'}
            img={require('../assets/covers/glass.jpg')}
          />
          )
        } else {
          navcard = (
            <NavCard
            key={i}
            title='Place Model'
            color='#92FE88'
            to={path(location, 'place-model')}
            text={'Place model'}
            img={require('../assets/covers/place-model.png')} />
          )
        }
        return navcard
      })}
    </ResponsiveGrid>
    <PwaInstallPrompt />
  </Page>
))

export {Home}

