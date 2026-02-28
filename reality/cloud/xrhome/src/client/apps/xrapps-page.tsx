import * as React from 'react'
import {Button, Header, Message, Container} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

import {sortByUsage} from '../common'
import {getPathForAccount, AccountPathEnum} from '../common/paths'
import ErrorMessage from '../home/error-message'
import ViolationNotice from '../home/violation-notice'
import AccountTierLabel from '../accounts/account-tier-label'
import {Loader} from '../ui/components/loader'
import AppListItem from './xr-app-list-item'
import type {RootState} from '../reducer'
import {useSelector} from '../hooks'
import useCurrentAccount from '../common/use-current-account'
import {Icon} from '../ui/components/icon'

/* eslint-disable local-rules/hardcoded-copy */

const getDeletedXRApps = ({usage, apps}: Pick<RootState, 'usage' | 'apps'>) => {
  const appKeys = apps.map(a => a.appKey)
  return usage.summaries.reduce<Record<string, string>>((o, v) => {
    if (v.appKey && !appKeys.includes(v.appKey)) {
      o[v.appKey] = v.appName
    }
    return o
  }, {})
}

const CreateAppButton: React.FC = () => {
  const account = useCurrentAccount()
  return (
    <Button
      icon
      labelPosition='right'
      as={Link}
      to={getPathForAccount(account, AccountPathEnum.createProject)}
      primary
    >
      Create a new App Key<Icon stroke='plus' size={1.6} inline />
    </Button>
  )
}

const XrAppsPage: React.FC = () => {
  const [lastCopiedAppKey, setLastCopiedAppKey] = React.useState(null)

  const rawApps = useSelector(s => s.apps)
  const usage = useSelector(s => s.usage)
  const deletedApps = getDeletedXRApps({usage, apps: rawApps})
  const apps = rawApps.sort(sortByUsage({usage}, 'TOTAL'))
  const appsLoading = useSelector(s => !!s.apps.loading)

  const appsList = (
    <>
      {!apps || !apps.length &&
        <div style={{marginTop: '40px', marginBottom: '20px'}}>
          <Message info>
            You haven't created any App Keys yet.  Create one to add AR functionality to your application.  It's FREE.
          </Message>
        </div>
        }

      {apps && apps.length > 0 &&
        <>

          {apps.map((a, i) => (
            <AppListItem
              key={a.appKey}
              app={a}
              active={i === 0}
              isCopied={a.appKey === lastCopiedAppKey}
              onCopy={(key, r) => r && setLastCopiedAppKey(key)}
            />
          ))}
          {Object.entries(deletedApps).length > 0 &&
            <>
              <Header as='h2'>Deleted XR Applications</Header>
              <p>These applications are deleted but were active within the past month.</p>
              {Object.entries(deletedApps).map(([appKey, appName]) => (
                <AppListItem
                  key={appKey}
                  app={{appKey, appName, status: 'DELETED'}}
                  isCopied={appKey === lastCopiedAppKey}
                  onCopy={(key, r) => r && setLastCopiedAppKey(key)}
                />
              ))}
            </>
            }
        </>
        }
    </>
  )

  return (
    <div>
      <Header as='h1' className='main'>XR Dashboard
        <AccountTierLabel />
      </Header>
      <ViolationNotice />
      <ErrorMessage />
      <Container className='topContainer content' fluid>

        <div style={{clear: 'both'}}>
          <p><a href='/downloads'>Download 8th Wall XR for Unity package</a> to use within your Unity project.</p>
          <p>
            An App Key is required to build and run mobile apps using 8th Wall XR.  Each mobile app
            you create requires a unique App Key that is tied to the bundle identifier of your app.
            It is recommended that you use the same bundle identifier, (i.e., package), on Android
            and iOS so one App Key can be used for Android and iOS versions of the same app.
          </p>
          <p>
            <b>NOTE:</b> Unity WebGL content is not currently supported on mobile devices.
            <a
              href='https://docs.unity3d.com/Manual/webgl-browsercompatibility.html'
              target='_blank'
              rel='noopener noreferrer'
            >
              Unity WebGL Browser Compatibility <Icon stroke='external' inline />
            </a>
            If you would like to develop WebAR,
            you will need to create a Basic workspace and develop using A-Frame,
            three.js, babylon.js, or Amazon Sumerian.
          </p>
        </div>

        <Header as='h2'>
          My XR Applications
        </Header>
        <CreateAppButton />
        {/* eslint-disable-next-line local-rules/ui-component-styling */}
        {appsLoading ? <Loader inline className='apps-list-loader' /> : appsList}

      </Container>
    </div>
  )
}

export default XrAppsPage
