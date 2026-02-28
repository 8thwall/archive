import React from 'react'
import {createUseStyles} from 'react-jss'
import {useHistory} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {FirstTimeUserCard} from './first-time-user-card'
import {brandWhite, tinyViewOverride} from '../../static/styles/settings'
import {FTUE_SAMPLE_PROJECTS} from './first-time-user-constants'
import useActions from '../../common/use-actions'
import actions from '../../apps/apps-actions'
import {useSelector} from '../../hooks'
import {AppPathEnum, getPathForApp} from '../../common/paths'
import {StaticBanner} from '../../ui/components/banner'

const useStyles = createUseStyles({
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    minHeight: '20em',
    color: brandWhite,
    padding: '2em 5em',
    [tinyViewOverride]: {
      'flexDirection': 'row',
      'overflowX': 'scroll',
      'padding': '2em 3em',
      '-ms-overflow-style': 'none',
      'scrollbarWidth': 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
  errorContainer: {
    padding: '2em 2em 0 2em',
  },
})

interface IFirstTimeAppsView {
  onAppDuplicateStart: () => void
  onAppDuplicateComplete: () => void
}

const FirstTimeAppsView: React.FC<IFirstTimeAppsView> = (
  {onAppDuplicateStart, onAppDuplicateComplete}
) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const accounts = useSelector(state => state.accounts.allAccounts)
  const toAccount = accounts[0]
  const history = useHistory()
  const {instantCloneApp} = useActions(actions)
  const [error, setError] = React.useState(false)

  const cloneApp = async (app) => {
    onAppDuplicateStart()
    setError(false)
    let generatedShortName = app.appName
    let index = 1
    // Handle potential app name collisions
    const isAppNameTaken = name => toAccount.Apps.find(a => a.appName === name)
    while (isAppNameTaken(generatedShortName)) {
      generatedShortName = `${app.appName}-${index}`
      index++
    }

    try {
      await instantCloneApp({
        appName: generatedShortName,
        isWeb: true,
        buildSettingsSplashScreen: 'DEMO',
        hostingType: 'CLOUD_STUDIO',
      },
      toAccount.uuid,
      app.uuid,
      `${app.accountName}.${app.appName}`)

      onAppDuplicateComplete()
      history.push(
        `${getPathForApp(toAccount, generatedShortName, AppPathEnum.studio)}?pendo=${app?.pendoId}`
      )
    } catch (err) {
      onAppDuplicateComplete()
      setError(true)
    }
  }

  return (
    <>
      {error &&
        <div className={classes.errorContainer}>
          <StaticBanner type='danger'>
            {t('account_dashboard_page.first_time_user_modal.error.failed_to_duplicate')}
          </StaticBanner>
        </div>
      }
      <div className={classes.modalBody}>
        {FTUE_SAMPLE_PROJECTS.map(app => (
          <FirstTimeUserCard
            key={app.title}
            app={app}
            onClick={() => { cloneApp(app) }}
          />
        ))}
      </div>
    </>
  )
}

export {
  FirstTimeAppsView,
}
