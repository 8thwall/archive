import React from 'react'
import {createUseStyles} from 'react-jss'
import {useHistory} from 'react-router-dom'
import {useTranslation, Trans} from 'react-i18next'

import {AppLoadingScreen} from '../apps/app-loading-screen'
import {PrimaryButton} from '../ui/components/primary-button'
import {SecondaryButton} from '../ui/components/secondary-button'
import {SpaceBetween} from '../ui/layout/space-between'
import AutoHeading from '../widgets/auto-heading'
import AutoHeadingScope from '../widgets/auto-heading-scope'
import {DetailedTextInput} from './text-input'
import {useEnclosedAccount} from '../accounts/enclosed-account-context'
import {
  AppLoadingScreenContextProvider,
  useAppLoadingScreenContext,
} from '../apps/widgets/loading-screen/app-loading-screen-context'
import type {IApp, IPublicAccount, IPublicApp} from '../common/types/models'
import {deriveAppCoverImageUrl, isOkAppName} from '../../shared/app-utils'
import {makeProjectSpecifier} from '../../shared/project-specifier'
import useActions from '../common/use-actions'
import appActions from '../apps/apps-actions'
import {getStudioPath} from './desktop-paths'
import {useSelector} from '../hooks'
import actions from '../browse/public-browse-actions'
import {Loader} from '../ui/components/loader'
import {StaticBanner} from '../ui/components/banner'
import {FloatingTrayModal} from '../ui/components/floating-tray-modal'
import {WHITE_20, WHITE_50} from './colors'

const EMPTY_PROJECT = BuildIf.ALL_QA
  ? {
    accountShortName: '8thwall',
    appName: 'studio-empty-template-qa',
  }
  : {
    accountShortName: '8thwall',
    appName: 'empty-project',
  }

const useStyles = createUseStyles({
  modalContainer: {
    display: 'flex',
    width: '56.25rem',
    padding: '5rem 3rem',
    minHeight: '60vh',
    justifyContent: 'center',
  },
  header: {
    fontFamily: 'Geist Mono !important',
    margin: 0,
  },
  description: {
    color: WHITE_50,
  },
  banner: {
  },
  appImage: {
    width: '12.25rem',
    aspectRatio: '98 / 55',
    borderRadius: '0.5rem',
    border: `1px solid ${WHITE_20}`,
    objectFit: 'cover',
  },
})

interface INewProjectContent {
  isNewProject: boolean
  fromAccount: IPublicAccount
  fromApp: IPublicApp
  onClose: () => void
}

const NewProjectContent: React.FC<INewProjectContent> = ({
  isNewProject, fromAccount, fromApp, onClose,
}) => {
  const {t} = useTranslation(['studio-desktop-pages', 'common'])
  const enclosedAccount = useEnclosedAccount()
  const classes = useStyles()
  const {startAppLoading, clearLoadingApp, isAppLoading} = useAppLoadingScreenContext()
  const [projectTitle, setProjectTitle] = React.useState('')
  const [projectUrl, setProjectUrl] = React.useState('')
  const {deleteAppImmediate, cloneIntoApp} = useActions(appActions)
  const history = useHistory()
  const apps = useSelector(state => state.apps)
  const isDuplicateAppName = apps.some(app => app.appName === projectUrl.trim())
  const isValidAppName = isOkAppName(projectUrl)
  const [showErrors, setShowErrors] = React.useState(false)

  const onBlur = () => {
    if (!isDuplicateAppName && isValidAppName) {
      setShowErrors(false)
    } else {
      setShowErrors(true)
    }
  }

  const cloneApp = async () => {
    let newApp: IApp
    try {
      newApp = await startAppLoading(deriveAppCoverImageUrl(fromApp), {
        appTitle: projectTitle.trim(),
        appName: projectUrl.trim(),
        isWeb: true,
        buildSettingsSplashScreen: 'DEMO',
        hostingType: 'CLOUD_STUDIO',
      })

      await cloneIntoApp({
        appUuid: newApp.uuid,
        fromAppUuid: fromApp.uuid,
        fromProjectSpecifier: makeProjectSpecifier(fromAccount, fromApp),
        deployment: 'published',
      })

      history.push(getStudioPath(newApp.appKey))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during app creation:', error)
      if (newApp) {
        deleteAppImmediate(newApp)
      }
      clearLoadingApp()
    }
  }

  if (isAppLoading) {
    return (
      <div className={classes.modalContainer}>
        <AppLoadingScreen />
      </div>
    )
  }

  return (
    <AutoHeadingScope>
      <form
        className={classes.modalContainer}
        onSubmit={(e) => {
          e.preventDefault()
          if (isValidAppName && !isDuplicateAppName) {
            cloneApp()
          } else {
            setShowErrors(true)
          }
        }}
      >
        <SpaceBetween direction='vertical'>
          <SpaceBetween direction='vertical' extraNarrow>
            <AutoHeading className={classes.header}>{isNewProject
              ? t('new_project_modal.title.new')
              : t('new_project_modal.title.duplicate')}
            </AutoHeading>
            <span> {t('new_project_modal.text.tagline')}</span>
          </SpaceBetween>
          {showErrors && !isValidAppName &&
            <div className={classes.banner}>
              <StaticBanner
                type='danger'
                message={t('new_project_modal.validation.title_format')}
              />
            </div>}
          {showErrors && isDuplicateAppName && <StaticBanner
            type='danger'
            message={t('new_project_modal.validation.duplicate_url')}
          />}
          <SpaceBetween extraWide>
            <SpaceBetween direction='vertical'>
              <SpaceBetween direction='vertical' narrow>
                <DetailedTextInput
                  iconStroke='box'
                  label={t('new_project_modal.input.prompt.title')}
                  value={projectTitle}
                  onChange={(e) => {
                    const {value} = e.target
                    setProjectTitle(value)
                    const newProjectUrl = value.toLowerCase().replace(/\s+/g, '-')
                    setProjectUrl(newProjectUrl)
                  }}
                  onBlur={onBlur}
                />
                <DetailedTextInput
                  iconStroke='link'
                  label={t('new_project_modal.input.prompt.project_url')}
                  value={projectUrl}
                  onChange={(e) => {
                    setProjectUrl(e.target.value)
                  }}
                  onBlur={onBlur}
                  prefix={`8thwall.com/${enclosedAccount.shortName}/`}
                />
              </SpaceBetween>
              <PrimaryButton
                type='submit'
                disabled={!isValidAppName || isDuplicateAppName}
              >
                {t('button.create', {ns: 'common'})}
              </PrimaryButton>
              <SecondaryButton onClick={() => onClose()}>
                {t('button.cancel', {ns: 'common'})}
              </SecondaryButton>
            </SpaceBetween>
            <SpaceBetween direction='vertical' extraNarrow>
              <img
                className={classes.appImage}
                src={deriveAppCoverImageUrl(fromApp)}
                alt={t('new_project_modal.label.app_cover')}
              />
              <span className={classes.description}>
                <Trans
                  ns='studio-desktop-pages'
                  i18nKey='new_project_modal.text.app_by_author'
                  values={{
                    appTitle: fromApp.appTitle,
                    authorName: fromAccount.name,
                  }}
                  components={{
                    1: <br />,
                  }}
                />
              </span>
            </SpaceBetween>
          </SpaceBetween>
        </SpaceBetween>
      </form>
    </AutoHeadingScope>
  )
}

interface INewProjectModalWithContext {
  accountShortName?: string
  appName?: string
  onClose: () => void
}

const NewProjectModal: React.FC<INewProjectModalWithContext> = ({
  accountShortName, appName, onClose,
}) => {
  const classes = useStyles()
  // NOTE(johnny): This is preloading the translations for the static banner.
  useTranslation(['common'])
  const selectedProject = (accountShortName && appName)
    ? {accountShortName, appName}
    : EMPTY_PROJECT

  const accountUuid = useSelector(
    state => state.publicBrowse.accountByName[selectedProject.accountShortName]
  )
  const appUuid = useSelector(state => state.publicBrowse.appByName[selectedProject.appName])
  const account = useSelector(state => state.publicBrowse.Accounts[accountUuid])
  const app = useSelector(state => state.publicBrowse.Apps[appUuid])
  const {getPublicAccountApp} = useActions(actions)
  const isLoading = selectedProject.accountShortName !== account?.shortName ||
  selectedProject.appName !== app?.appName

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        await getPublicAccountApp(selectedProject.accountShortName, selectedProject.appName)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching public app:', error)
      }
    }
    fetchData()
  }, [selectedProject.accountShortName, selectedProject.appName])

  return (
    <FloatingTrayModal
      startOpen
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
      trigger={undefined}
    >
      {() => (
        isLoading
          ? (
            <div className={classes.modalContainer}>
              <Loader />
            </div>
          )
          : (
            <AppLoadingScreenContextProvider>
              <NewProjectContent
                isNewProject={!accountShortName && !appName}
                fromAccount={account}
                fromApp={app}
                onClose={onClose}
              />
            </AppLoadingScreenContextProvider>
          )
      )}
    </FloatingTrayModal>
  )
}

export {
  NewProjectModal,
}
