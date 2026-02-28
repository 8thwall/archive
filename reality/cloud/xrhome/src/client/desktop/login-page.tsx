import React from 'react'
import {Redirect} from 'react-router-dom'
import {v4 as uuid} from 'uuid'

import {useTranslation} from 'react-i18next'

import {createElectronUrl} from '../../shared/studiohub/create-electron-url'
import {HOME_PATH} from './desktop-paths'
import useActions from '../common/use-actions'
import {hasUserSession} from '../user/has-user-session'
import {useSelector} from '../hooks'
import userNianticActions from '../user-niantic/user-niantic-actions'
import {SpaceBetween} from '../ui/layout/space-between'
import {PrimaryButton} from '../ui/components/primary-button'
import {createBrowserUrl} from '../../shared/studiohub/create-browser-url'
import {createStudioHubUrl} from './create-studiohub-url'
import * as ConsoleServerUrls from '../../shared/studiohub/console-server-url-types'
import {Loader} from '../ui/components/loader'
import AutoHeading from '../widgets/auto-heading'
import useQuery from '../common/use-query'

const LoginPage: React.FC = () => {
  const actions = useActions(userNianticActions)
  const clientIdRef = React.useRef<string | null>(null)
  const isLoggedIn = useSelector(hasUserSession)
  const [loggingIn, setLoggingIn] = React.useState(false)
  const query = useQuery()
  const token = query.get('token')
  const clientId = query.get('clientId')
  const {t} = useTranslation(['studio-desktop-pages'])

  React.useEffect(() => {
    if (token && clientId && clientId === clientIdRef.current) {
      setLoggingIn(true)
      actions.loginWithToken(token)
    }
  }, [token, clientId])

  if (isLoggedIn) {
    return <Redirect to={HOME_PATH} />
  }

  if (loggingIn) {
    return <Loader />
  }

  return (
    <SpaceBetween direction='vertical' centered between grow>
      <SpaceBetween direction='vertical' centered justifyCenter grow>
        {window.electron.consoleServerUrl !== ConsoleServerUrls.PROD &&
          <PrimaryButton
            onClick={() => {
              window.open(createElectronUrl(window.electron.consoleServerUrl))
            }}
            // eslint-disable-next-line local-rules/hardcoded-copy
          >
            [ALL_QA] Check connectivity to server (CLICK HERE BEFORE DOING ANYTHING!!!)
          </PrimaryButton>
        }
        <div>
          <AutoHeading>{t('login_page.title.welcome')}</AutoHeading>
        </div>
        <div>
          <PrimaryButton
            onClick={() => {
              clientIdRef.current = uuid()
              const redirectUrl = createBrowserUrl('desktop-login', {
                desktopRedirect: createStudioHubUrl('/login', {
                  clientId: clientIdRef.current,
                }),
              })
              window.open(redirectUrl)
            }}
          >
            {t('login_page.button.sign_in')}
          </PrimaryButton>
        </div>
      </SpaceBetween>
    </SpaceBetween>
  )
}

export {
  LoginPage,
}
