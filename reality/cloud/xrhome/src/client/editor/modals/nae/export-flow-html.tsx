import React from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import {Link, useParams} from 'react-router-dom'

import type {NaeBuilderRequest, RefHead} from '../../../../shared/nae/nae-types'
import {PublishPageWrapper} from '../../publishing/publish-page-wrapper'
import {BuildButton} from './build-button'
import {PublishTipBanner} from '../../publishing/publish-tip-banner'
import {useNaeStyles} from './nae-styles'
import {StandardFieldLabel} from '../../../ui/components/standard-field-label'
import {Icon} from '../../../ui/components/icon'
import {combine} from '../../../common/styles'
import {usePublishingStateContext} from '../../publishing/publish-context'
import {useCurrentGit, useGitActiveClient} from '../../../git/hooks/use-current-git'
import {useCurrentRepoId} from '../../../git/repo-id-context'
import {createNaeProjectUrl} from '../../../../shared/hosting-urls'
import useCurrentAccount from '../../../common/use-current-account'
import useCurrentApp from '../../../common/use-current-app'
import useActions from '../../../common/use-actions'
import naeActions from '../../../studio/actions/nae-actions'
import {RowJointToggleButton} from '../../../studio/configuration/row-fields'
import {getBuildEnvOptions} from './build-env-options'
import {getExportDisabled, type Steps} from './utils'
import {BuildFinishedPage} from './build-finished-page'
import {useSceneContext} from '../../../studio/scene-context'
import {LearnMoreText} from '../../publishing/learn-more-text'
import {UNSUPPORTED_FEATURES_HTML} from './features'
import {getActiveCreditGrant} from '../../../../shared/feature-utils'
import {CREDIT_GRANT_FEATURE} from '../../../../shared/feature-config'
import {isEnterprise, isPro} from '../../../../shared/account-utils'
import {PrimaryButton} from '../../../ui/components/primary-button'
import {AccountPathEnum, getPathForAccount} from '../../../common/paths'
import {SupportedPlatforms} from './supported-platforms'

interface IExportFlowHtml {
  onClose: () => void
}

const ExportFlowHtml: React.FC<IExportFlowHtml> = ({onClose}) => {
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const classes = useNaeStyles()
  const app = useCurrentApp()
  const {htmlShellToNaeBuildData, setHtmlShellToNaeBuildData} = usePublishingStateContext()
  const naeBuildData = htmlShellToNaeBuildData.html
  const repoId = useCurrentRepoId()
  const {name: activeClient} = useGitActiveClient()
  const account = useCurrentAccount()
  const git = useCurrentGit()
  const dispatch = useDispatch()
  const {postNaeBuild} = useActions(naeActions)
  const activeRef: RefHead = `${git.repo.handle}-${activeClient}`
  const [ref, setRef] = React.useState<RefHead>(activeRef)
  const activeCreditGrant = getActiveCreditGrant(account.Features)
  const {account: fromWorkspace} = useParams<{account: string}>()

  const havePaidAccount = React.useMemo(() => {
    const isPower = activeCreditGrant?.optionName === CREDIT_GRANT_FEATURE.PowerSub.name
    const isCore = activeCreditGrant?.optionName === CREDIT_GRANT_FEATURE.CoreSub.name
    return isPower || isCore || isPro(account) || isEnterprise(account)
  }, [activeCreditGrant?.optionName, account.Features])

  const [currentStep, setCurrentStep] = React.useState<Steps>('start')

  const sceneCtx = useSceneContext()
  const exportDisabled = React.useMemo(
    () => getExportDisabled(sceneCtx, 'html'),
    [sceneCtx.scene.objects]
  )

  React.useEffect(() => {
    switch (naeBuildData.naeBuildStatus) {
      case 'success':
        setCurrentStep('finished')
        break
      case 'failed':
        setHtmlShellToNaeBuildData('html', {
          naeBuildStatus: 'noBuild',
          buildRequest: null,
          buildNotification: null,
        })
        break
      default:
        break
    }
  }, [naeBuildData.naeBuildStatus])

  const handleExport = async () => {
    if (!havePaidAccount || exportDisabled) {
      return
    }

    setHtmlShellToNaeBuildData('html', {
      naeBuildStatus: 'building',
      buildRequest: null,
      buildNotification: null,
    })
    dispatch({type: 'ERROR', msg: null})

    const naeBuilderRequest: NaeBuilderRequest = {
      // We add this b/c we want the type to have it, but we let the server fill it.
      requestUuid: '',
      shellVersion: '',
      removeExistingShellVersion: false,
      projectUrl: createNaeProjectUrl(account.shortName, app.appName, ref),
      shell: 'html',
      appInfo: {
        refHead: ref,
        workspace: account.shortName,
        appName: app.appName,
        appDisplayName: app.appName,  // NOTE(lreyna): Only used for displaying in historical builds
        // NOTE(lreyna): These are not used for HTML builds. They are set to undefined for
        // the type checker + makes it clear that they are not used.
        screenOrientation: undefined,
        statusBarVisible: undefined,
        naeBuildMode: undefined,
        bundleIdentifier: undefined,
        resourceDir: undefined,
        versionName: undefined,
      },
      appUuid: app.uuid,
      accountUuid: account.uuid,
      buildRequestTimestampMs: Date.now(),
      exportType: 'zip',
      requestRef: activeRef,
      repoId,
    }
    const result = await postNaeBuild(naeBuilderRequest)
    if (!result) {
      setHtmlShellToNaeBuildData('html', {
        naeBuildStatus: 'noBuild',
        buildRequest: null,
        buildNotification: null,
      })
    } else {
      setHtmlShellToNaeBuildData('html', {
        naeBuildStatus: 'building',
        buildRequest: naeBuilderRequest,
        buildNotification: null,
      })
    }
  }

  const buildEnvOptions = getBuildEnvOptions(t, git, activeRef, classes)

  const isBuilding = naeBuildData.naeBuildStatus === 'building'

  const getPublishPageWrapperDisplayText = () => {
    if (!havePaidAccount) {
      return (
        <div className={classes.iconAndTextContainer}>
          <Icon stroke='info' color='info' size={0.75} />
          <span className={combine(classes.displayText, classes.upgrade)}>
            {t('editor_page.export_modal.html_export.upgrade_text')}
          </span>
        </div>
      )
    } else if (exportDisabled) {
      return (
        <div className={classes.iconAndTextContainer}>
          <Icon stroke='info' color='danger' size={0.75} />
          <span className={combine(classes.displayText, classes.error)}>
            {t('editor_page.native_publish_modal.export_disabled_text')}
          </span>
        </div>
      )
    } else if (isBuilding) {
      return (
        <span className={classes.displayText}>
          {t('editor_page.native_publish_modal.building_text')}
        </span>
      )
    }

    return null
  }

  if (currentStep === 'finished') {
    return (
      <BuildFinishedPage
        platform='html'
        exportDisabled={false}
        setCurrentStep={setCurrentStep}
      />
    )
  }

  return (
    <PublishPageWrapper
      headline={t('editor_page.native_publish_modal.publish_headline_first.html')}
      headlineType='web'
      showProgressBar={isBuilding}
      displayText={getPublishPageWrapperDisplayText()}
      actionButton={havePaidAccount
        ? (<BuildButton
            isBuilding={isBuilding}
            buildDisabled={exportDisabled}
            onClose={onClose}
            handleExport={handleExport}
        />)
        : (
          <Link
            to={{
              pathname: getPathForAccount(account, AccountPathEnum.account),
              state: {
                fromWorkspace,
              },
            }}
          >
            <PrimaryButton
              // eslint-disable-next-line local-rules/ui-component-styling
              className={classes.buildButton}
              a8='click;studio-export-flow-html;upgrade'
              color='purple'
              height='small'
            >
              <Icon
                stroke='crown'
              />
              {t('editor_page.export_modal.html_export.upgrade_now')}
            </PrimaryButton>
          </Link>)
      }
    >
      <div className={classes.rightCol}>
        {isBuilding && <div className={combine(classes.dimmer, classes.smallMonitorVisible)} />}

        <PublishTipBanner
          iconStroke='pointLight'
          url='https://8th.io/nae-html-export'
          content={t(
            'editor_page.export_modal.html_export.explanation'
          )}
          showLearnMore
        />

        <SupportedPlatforms
          platforms={[
            {
              name:
              t('editor_page.export_modal.html_export.supported_platforms.your_server'),
              url: 'https://8th.io/nae-html-export-your-server',
            },
            // eslint-disable-next-line local-rules/hardcoded-copy
            {name: 'Itch.io', url: 'https://8th.io/nae-html-export-itch'},
            // eslint-disable-next-line local-rules/hardcoded-copy
            {name: 'Discord', url: 'https://8th.io/nae-html-export-discord'},
            // eslint-disable-next-line local-rules/hardcoded-copy
            {name: 'Viverse', url: 'https://8th.io/nae-html-export-viverse'},
          ]}
        />

        <div>
          <div className={classes.rowLabel}>
            <StandardFieldLabel
              label={t('editor_page.native_publish_modal.upcoming_features.title')}
            />
          </div>
          <PublishTipBanner
            url='https://8th.io/nae-docs#requirements'
            content={(
              <div className={classes.unsupportedExportList}>
                <div className={classes.unsupportedExportsIntro}>
                  {t('editor_page.native_publish_modal.upcoming_features.intro')}
                </div>
                <div className={classes.exportItemGrid}>
                  {UNSUPPORTED_FEATURES_HTML.map((item) => {
                    const unsupportedItemName = t(item)
                    return (
                      <div className={classes.exportItem} key={unsupportedItemName}>
                        <span className={classes.exportItemText}>
                          {unsupportedItemName}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className={classes.unsupportedExportLearnMoreLinkContainer}>
                  <LearnMoreText
                    a8='click;cloud-editor-export-flow;unsupported-features-learn-more'
                  />
                </div>
              </div>
            )}
          />
        </div>

        <RowJointToggleButton
          id='buildEnv'
          label={t('editor_page.export_modal.build_env')}
          options={buildEnvOptions}
          onChange={(selected) => { setRef(selected) }}
          value={ref}
        />
      </div>
    </PublishPageWrapper>
  )
}

export {ExportFlowHtml}
