import React from 'react'
import {Link, useParams} from 'react-router-dom'
import {createUseStyles} from 'react-jss'
import {Button} from 'semantic-ui-react'
import {join} from 'path'
import {useTranslation, Trans} from 'react-i18next'

import type {IAccount, IApp} from '../../common/types/models'
import {isEditorVisible, isSelfHostingEnabled} from '../../../shared/account-utils'
import {is8thWallHosted, isAdApp, isCloudEditorApp} from '../../../shared/app-utils'
import {
  getPathForAppNoTrailing, AppPathEnum, getPathForAccount, AccountPathEnum,
} from '../../common/paths'
import WebDevelopmentModeView from '../web-development-mode-view'
import * as settings from '../../static/styles/settings'
import {MILLISECONDS_PER_SECOND} from '../../../shared/time-utils'
import {useDocumentVisibility} from '../../hooks/use-document-visibility'
import useAppSharingInfo from '../../common/use-app-sharing-info'
import {useAppPathsContext} from '../../common/app-container-context'
import {Icon} from '../../ui/components/icon'

interface ITopProjectSection {
  app: IApp
  account: IAccount
}

const useStyles = createUseStyles({
  cloneButton: {
    color: `${settings.gray5} !important`,
    boxShadow: `0 0 0 1px ${settings.gray5} inset !important`,
  },
})

const DEV_MODE_AUTO_CLOSE_MS = 60 * MILLISECONDS_PER_SECOND

const TopProjectSection: React.FunctionComponent<ITopProjectSection> = ({app, account}) => {
  const [devModeOpened, setDevModeOpened] = React.useState(false)
  const onDevModeToggle = () => {
    setDevModeOpened(!devModeOpened)
  }
  const {account: fromWorkspace} = useParams<{account: string}>()

  const classes = useStyles()
  const isDisabled = app.status === 'DISABLED'
  const visibility = useDocumentVisibility()
  const {isExternalApp} = useAppSharingInfo(app)
  const {getPathForApp, getPathForFile} = useAppPathsContext()
  const {t} = useTranslation(['app-pages', 'common'])
  const isAppCloneable = !isExternalApp && !isAdApp(app)
  const isEditorAccessible = is8thWallHosted(app) && isEditorVisible(account)
  // If the tab isn't visible, close the dev mode section after a bit, since it polls the server
  // continuously while open.
  React.useEffect(() => {
    if (!devModeOpened || visibility !== 'hidden') {
      return undefined
    }
    const timeout = setTimeout(() => {
      setDevModeOpened(false)
    }, DEV_MODE_AUTO_CLOSE_MS)

    return () => clearTimeout(timeout)
  }, [devModeOpened, visibility])

  if (app.isCamera && !isDisabled) {
    return null
  }

  const appPath = getPathForAppNoTrailing(account, app)
  const duplicateAppPath = join(
    getPathForAccount(account, AccountPathEnum.duplicateProject), appPath
  )

  return (
    <>
      <div className='top-project-section'>
        {isDisabled &&
          <section className='disabled-warning'>
            <Icon stroke='warning' inline />
            <p>
              <strong>
                {t('project_dashboard_page.top_project_section.project_disabled')}
              </strong><br />
              {app.isCommercial &&
                <span>{t('project_dashboard_page.top_project_section.still_charged')}</span>
              }
              <Trans
                ns='app-pages'
                i18nKey='project_dashboard_page.top_project_section.to_renable'
                components={{
                  1: <Link className='inline-link' to={getPathForApp(AppPathEnum.settings)} />,
                }}
              />
            </p>
          </section>
        }
        {!app.isCamera &&
          <div className='button-container'>
            {isSelfHostingEnabled(account) &&
              <Button
                basic
                color={devModeOpened ? 'black' : 'purple'}
                onClick={onDevModeToggle}
                content={t('project_dashboard_page.top_project_section.button.authorization')}
              />
            }
            {isAppCloneable &&
              <Button
                basic
                className={classes.cloneButton}
                as={Link}
                to={{
                  pathname: duplicateAppPath,
                  state: {fromWorkspace},
                }}
                content={t('button.clone_project', {ns: 'common'})}
              />}
            {isEditorAccessible && (
              <Button
                as={Link}
                primary
                to={getPathForFile('')}
                content={t(
                  isCloudEditorApp(app)
                    ? 'project_dashboard_page.top_project_section.button.open_editor'
                    : 'project_dashboard_page.top_project_section.button.open_studio'
                )}
              />
            )}
          </div>
        }
      </div>

      {devModeOpened &&
        <WebDevelopmentModeView />
      }
    </>
  )
}

export default TopProjectSection
