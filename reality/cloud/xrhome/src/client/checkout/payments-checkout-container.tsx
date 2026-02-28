import React from 'react'
import {createUseStyles} from 'react-jss'
import {Switch, Route, useRouteMatch} from 'react-router-dom'
import {join} from 'path'

import {PaymentsCheckoutContainerEnum, PaymentsCheckoutEnum} from '../common/paths'
import CheckoutConfirmationPage from './checkout-confirmation-page'
import LiveModeCheckoutPage from './live-mode-checkout-page'
import TestModeCheckoutPage from './test-mode-checkout-page'
import NotFoundPage from '../home/not-found-page'
import LiveModeOrderProvider from './live-mode-order-provider'
import TestModeBanner from './test-mode-banner'
import TestModeOrderProvider from './test-mode-order-provider'
import withTranslationsLoaded from '../i18n/with-translations-loaded'
import {brandWhite} from '../static/styles/settings'

const useStyles = createUseStyles({
  backgroundContainer: {
    background: brandWhite,
    display: 'flex',
    minHeight: '100%',
    width: '100%',
    position: 'absolute',
  },
})

const LIVE_ROUTES = [
  {name: 'Checkout', path: PaymentsCheckoutEnum.checkout, Component: LiveModeCheckoutPage},
  {name: 'Confirmation', path: PaymentsCheckoutEnum.confirmation, Component: CheckoutConfirmationPage},
]

const TEST_ROUTES = [
  {
    name: 'Test Checkout',
    path: PaymentsCheckoutEnum.checkout,
    Component: TestModeCheckoutPage,
  },
  {
    name: 'Test Confirmation',
    path: PaymentsCheckoutEnum.confirmation,
    Component: CheckoutConfirmationPage,
  },
]

const BackgroundColorContainer: React.FC<React.PropsWithChildren> = ({children}) => {
  const classes = useStyles()
  return (
    <div className={classes.backgroundContainer}>
      {children}
    </div>
  )
}

const TestCheckoutContainer: React.FC = () => {
  const match = useRouteMatch()
  return (
    <Switch>
      {TEST_ROUTES.map(({name, path, Component}) => (
        <Route exact key={name} path={join(match.path, path)}>
          <TestModeOrderProvider>
            <BackgroundColorContainer>
              <TestModeBanner />
              <Component />
            </BackgroundColorContainer>
          </TestModeOrderProvider>
        </Route>
      ))}

      <Route path={match.path}><NotFoundPage /></Route>
    </Switch>
  )
}

const LiveCheckoutContainer: React.FC = () => {
  const match = useRouteMatch()
  return (
    <Switch>
      {LIVE_ROUTES.map(({name, path, Component}) => (
        <Route exact key={name} path={join(match.path, path)}>
          <LiveModeOrderProvider>
            <BackgroundColorContainer>
              <Component />
            </BackgroundColorContainer>
          </LiveModeOrderProvider>
        </Route>
      ))}

      <Route path={match.path}><NotFoundPage /></Route>
    </Switch>
  )
}

/**
 * Top-level component for 8thwall.com/checkout. This will manage the checkout session for in-app
 * purchases made within 8th Wall apps via the Payments API.
 */
const PaymentsCheckoutContainer: React.FC = () => {
  const match = useRouteMatch()

  if (!BuildIf.LOCAL_DEV && !window.opener) {
    // This page was directly navigated to. Until persistent purchase history is implemented,
    // we expect this page to be opened via an 8th Wall app. Don't allow users to make
    // purchases if we can't detect the 8th Wall app which opened this checkout page.
    return <NotFoundPage />
  }

  return (
    <Switch>
      <Route path={join(match.path, PaymentsCheckoutContainerEnum.test)}>
        <TestCheckoutContainer />
      </Route>

      <Route path={join(match.path, PaymentsCheckoutContainerEnum.live)}>
        <LiveCheckoutContainer />
      </Route>

      <Route path={match.path}><NotFoundPage /></Route>
    </Switch>
  )
}

export default withTranslationsLoaded(PaymentsCheckoutContainer)  // set in app.tsx
