import React from 'react'
import {createUseStyles} from 'react-jss'
import {useLocation, useHistory} from 'react-router-dom'
import querystring from 'query-string'

import {getPathForAccountOnboarding} from '../../common/paths'
import {mobileViewOverride} from '../../static/styles/settings'
import Page from '../../widgets/page'
import {VerifyEmail} from './verify-email'
import {useCurrentUser} from '../use-current-user'
import {WelcomeBackground} from '../../widgets/welcome-background'
import {HeroContainer} from '../../widgets/hero-container'

const useStyles = createUseStyles({
  container: {
    'height': '100%',
    'width': '100%',
    'overflow-x': 'hidden',
    'backgroundRepeat': 'no-repeat',
    '& .page-content': {
      'display': 'flex !important',
      'margin': '0 auto',
      [mobileViewOverride]: {
        padding: '0 1em',
      },
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    width: '32em',
    textAlign: 'center',
    [mobileViewOverride]: {
      maxWidth: '32em',
      width: 'unset',
    },
  },
})

const EmailVerificationSignUpPage: React.FunctionComponent = (
) => {
  const emailConfirmed = useCurrentUser(user => user.email_verified === 'true')
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()

  const nextStep = querystring.parse(location.search).redirectTo || getPathForAccountOnboarding()

  if (emailConfirmed) {
    history.push(nextStep)
  }

  const onVerifyEmailSuccess = () => {
    history.push(nextStep)
  }

  return (
    <Page
      className={classes.container}
      hasHeader={false}
      hasFooter={false}
      centered={false}
    >
      <WelcomeBackground />
      <div className={classes.form}>
        <HeroContainer>
          <div className={classes.heroContent}>
            <VerifyEmail
              onVerifyEmailSuccess={onVerifyEmailSuccess}
              verificationBehavior='sign-up'
            />
          </div>
        </HeroContainer>
      </div>
    </Page>
  )
}

export default EmailVerificationSignUpPage
