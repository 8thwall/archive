import React from 'react'
import {Link} from 'react-router-dom'
import {Icon} from 'semantic-ui-react'
import {TFunction, useTranslation} from 'react-i18next'

import {
  makeHostedDevelopmentUrl, makeHostedProductionUrl, makeHostedStagingUrl,
} from '../../../shared/hosting-urls'
import {getPathForAccount, AccountPathEnum} from '../../common/paths'
import {useTheme} from '../../user/use-theme'
import {ArchivedRedirect} from '../archived-redirect'
import useCurrentApp from '../../common/use-current-app'
import {useCurrentGit} from '../../git/hooks/use-current-git'
import useActions from '../../common/use-actions'
import appsActions from '../../apps/apps-actions'
import useCurrentAccount from '../../common/use-current-account'
import {getCommitFromLogs} from '../../git/g8-commit'
import ColoredMessage from '../../messages/colored-message'
import {actions as gitActions} from '../../git/git-actions'
import {useUnsafeTargets} from '../use-unsafe-targets'
import {StaticBanner} from '../../ui/components/banner'
import {bool, combine} from '../../common/styles'
import {createThemedStyles} from '../../ui/theme'
import {PrimaryButton} from '../../ui/components/primary-button'
import {isArchived, isAppLicenseType} from '../../../shared/app-utils'
import {DeploymentInfoBox as OldDeploymentInfoBox} from './old-publish-deployment-info'
import {UnpublishButton} from './unpublish-button'
import {PublishTipBanner} from './publish-tip-banner'
import {PublishCommitTable} from './publish-commit-table'
import {PassphraseChanger} from './publish-passphrase-changer'
import {PublishingPrimaryButton} from './publish-primary-button'
import {PublishPageWrapper} from './publish-page-wrapper'
import type {LandPublishState} from '../hooks/use-land-publish-state'
import {TextButton} from '../../ui/components/text-button'
import {tinyViewOverride} from '../../static/styles/settings'

const useStyles = createThemedStyles(theme => ({
  oldDeploymentInfoTable: {
    // TODO (tri) maybe pull this border out into a theme variable
    'border': `1px solid ${theme.modalContainerBg}`,
    'borderRadius': '0.5rem',
    'borderSpacing': '0',
    'width': '100%',
    'tableLayout': 'fixed',
    '& td': {
      padding: '0.5rem 0.75rem',
      borderStyle: 'none',
      whiteSpace: 'nowrap',
    },
    [tinyViewOverride]: {
      'display': 'block',
      '& tbody, & tr, & td': {
        display: 'block',
        width: '100%',
      },
      '& td': {
        whiteSpace: 'normal',
        borderBottom: `1px solid ${theme.modalContainerBg}`,
      },
    },
  },
  deploymentInfoTable: {
    // TODO (tri) maybe pull this border out into a theme variable
    'border': `1px solid ${theme.modalContainerBg}`,
    'borderRadius': '0.5rem',
    'borderSpacing': '0',
    'width': '100%',
    'tableLayout': 'fixed',
    '& td': {
      padding: '0.5rem 0.75rem',
      borderStyle: 'none',
      whiteSpace: 'nowrap',
    },
  },
  deploymentInfoTableWrapper: {
    overflow: 'auto',
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  uiModal: {
    'display': 'flex',
    'overflow': 'hidden',
    'flex': '1 1 auto',
    'flexDirection': 'column',
    '& > :not(last-child)': {
      'marginBottom': '1em',
    },
    'minWidth': '100%',
    [tinyViewOverride]: {
      maxHeight: '40vh',
    },
  },
  unpublishBanner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  unpublishButton: {
    width: '10rem',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: '1.5rem',
    [tinyViewOverride]: {
      // On large monitors, we don't allow scroling and fix the commits table to just the remaining
      // height on screen. But this doesn't work on small monitors. So here we allow the content to
      // scroll, and then use maxHeight on uiModal to limit the size of the commits table to a
      // reasonable height.
      height: 'auto',
    },
  },
  unpublishButtonsContainer: {
    display: 'flex',
    gap: '0.5rem',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
}))

interface IUnpublishBanner {
  onConfirm: () => void
  onCancel: () => void
}

const UnpublishBanner: React.FC<IUnpublishBanner> = ({
  onConfirm, onCancel,
}) => {
  const {t} = useTranslation(['cloud-editor-pages'])
  const classes = useStyles()
  const {publicFeatured: isFeatured} = useCurrentApp()

  return (
    <StaticBanner type='warning'>
      <div className={classes.unpublishBanner}>
        <span>
          {isFeatured
            ? t('editor_page.unpublish_modal.unpublish_public.blurb.is_featured')
            : t('editor_page.publish_modal.unpublish_warning.text')}
        </span>
        <div className={classes.unpublishButtonsContainer}>
          <PublishingPrimaryButton
            className={classes.unpublishButton}
            type='button'
            height='small'
            onClick={() => onConfirm()}
          >
            {t('editor_page.publish_modal.unpublish_warning.button.confirm')}
          </PublishingPrimaryButton>
          <TextButton
            height='small'
            /* eslint-disable-next-line local-rules/ui-component-styling */
            className={classes.unpublishButton}
            type='button'
            onClick={() => onCancel()}
          >
            {t('editor_page.publish_modal.unpublish_warning.button.cancel')}
          </TextButton>
        </div>
      </div>
    </StaticBanner>
  )
}

interface IPublishContent {
  publish: (productionHash, stagingHash) => void
  landPublishState: LandPublishState | null
}

const getDidNotAutoPulblishAfterLandDeployments = (
  t: TFunction, landPublishState: LandPublishState | null
): string => {
  if (
    landPublishState?.pendingLandAndPublishStagingCommitId &&
    landPublishState?.pendingLandAndPublishProductionCommitId
  ) {
    return `${t(
      'editor_page.deployment_type.staging'
    )} & ${t('editor_page.deployment_type.public')}`
  } else if (landPublishState?.pendingLandAndPublishStagingCommitId) {
    return `${t('editor_page.deployment_type.staging')}`
  } else if (landPublishState?.pendingLandAndPublishProductionCommitId) {
    return `${t('editor_page.deployment_type.public')}`
  }

  return ''
}

const PublishContent: React.FC<IPublishContent> = (
  {publish, landPublishState}
) => {
  const classes = useStyles()
  const app = useCurrentApp()

  const [publishing, setPublishing] = React.useState(false)
  const [pendingStagingHash, setPendingStagingHash] = React.useState<string>(
    landPublishState?.pendingLandAndPublishStagingCommitId || null
  )
  const [showPassphraseChanger, setShowPassphraseChanger] = React.useState(
    Boolean(!app.passphrase && landPublishState?.pendingLandAndPublishStagingCommitId)
  )
  // eslint-disable-next-line max-len
  const [showUnpublishDialog, setShowUnpublishDialog] = React.useState<'staging' | 'production' | null>(null)
  const [unpublishing, setUnpublishing] = React.useState(false)
  const [settingPassphrase, setSettingPassphrase] = React.useState(false)
  const [productionHash, setProductionHash] = React.useState<string>(
    landPublishState?.pendingLandAndPublishProductionCommitId || null
  )
  const [stagingHash, setStagingHash] = React.useState<string>(
    landPublishState?.pendingLandAndPublishStagingCommitId || null
  )

  const publishRef = React.useRef<HTMLButtonElement>()

  const account = useCurrentAccount()
  const git = useCurrentGit()
  const themeName = useTheme()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])

  const {deployment, logs} = git
  const newStagingHash = stagingHash || deployment.staging
  const newProductionHash = productionHash || deployment.production
  const disableDeploymentMenu = showUnpublishDialog || showPassphraseChanger || publishing ||
    unpublishing || settingPassphrase

  React.useEffect(() => {
    if (publishing) {
      if (deployment.staging === newStagingHash && deployment.production === newProductionHash) {
        setPublishing(false)
        setStagingHash(null)
        setProductionHash(null)
      }
    }
  }, [publishing, deployment.staging, deployment.production])

  const {updateApp} = useActions(appsActions)
  const {undeployBranch} = useActions(gitActions)

  const handleSubmit = async () => {
    setPublishing(true)
    await publish(
      newProductionHash !== deployment.production ? newProductionHash : null,
      newStagingHash !== deployment.staging ? newStagingHash : null
    )
  }

  const handleVersionSelect = async (hash: string, deploymentTarget: 'staging' | 'production') => {
    if (publishing) {
      return
    }

    if (deploymentTarget === 'staging') {
      if (!app.passphrase) {
        setPendingStagingHash(hash)
        setShowPassphraseChanger(true)
        setStagingHash(hash)
      } else {
        setStagingHash(hash)
      }
    } else {
      setProductionHash(hash)
    }

    publishRef.current.focus()
  }

  const handlePassphraseSubmit = async (newPassphrase: string) => {
    setSettingPassphrase(true)

    try {
      await updateApp({
        uuid: app.uuid,
        passphrase: newPassphrase,
      })

      setStagingHash(pendingStagingHash)
    } finally {
      setSettingPassphrase(false)
      setShowPassphraseChanger(false)
      setPendingStagingHash(null)
      publishRef.current.focus()
    }
  }

  // If it doesn't have a public featured account and is a APP licensed project, show notification
  const showPublicProfileNotice = isAppLicenseType(app) && !account?.publicFeatured

  const publishDisabled = (
    newStagingHash === deployment.staging &&
    newProductionHash === deployment.production
  ) || showPublicProfileNotice || showPassphraseChanger

  const unsafeTargets = useUnsafeTargets(newProductionHash)
  const isUnsafe = (newProductionHash !== deployment.production &&
    unsafeTargets.status !== 'loading' && unsafeTargets?.aliases?.length > 0)

  const didNotAutoPulblishAfterLandDeployments = getDidNotAutoPulblishAfterLandDeployments(
    t, landPublishState
  )

  return (
    <PublishPageWrapper
      headline={t('editor_page.native_publish_modal.publish_headline')}
      headlineType='web'
      actionButton={(
        <PrimaryButton
          type='submit'
          height='small'
          disabled={publishDisabled}
          loading={publishing}
          ref={publishRef}
          onClick={handleSubmit}
          a8='click;cloud-editor-publish-flow;confirm-publish-button'
        >{t('editor_page.button.publish')}
        </PrimaryButton>
      )}
    >
      <div className={classes.content}>
        {didNotAutoPulblishAfterLandDeployments &&
          <ColoredMessage color='yellow'>
            <div>
              {t('editor_page.deployments.did_not_to_publish_after_land', {
                deployments: didNotAutoPulblishAfterLandDeployments,
              })}
            </div>
          </ColoredMessage>
        }

        <table className={combine(
          classes.oldDeploymentInfoTable,
          bool(!!disableDeploymentMenu, classes.disabled)
        )}
        >
          <tbody>
            <OldDeploymentInfoBox
              name={t('editor_page.deployment_type.latest')}
              nameValue='latest'
              commit={getCommitFromLogs(deployment.master, logs)}
              href={makeHostedDevelopmentUrl(account.shortName, app.appName)}
            />
            <OldDeploymentInfoBox
              name={t('editor_page.deployment_type.staging')}
              nameValue='staging'
              commit={getCommitFromLogs(deployment.staging, logs)}
              href={makeHostedStagingUrl(account.shortName, app.appName)}
              unpublishWidget={(
                <UnpublishButton
                  deploymentTarget='staging'
                  loading={unpublishing}
                  onClick={() => {
                    setShowUnpublishDialog('staging')
                  }}
                  disabled={!!disableDeploymentMenu}
                />
              )}
            />
            <OldDeploymentInfoBox
              name={t('editor_page.deployment_type.public')}
              nameValue='public'
              commit={getCommitFromLogs(deployment.production, logs)}
              href={makeHostedProductionUrl(account.shortName, app.appName)}
              unpublishWidget={(
                <UnpublishButton
                  deploymentTarget='production'
                  disabled={!!disableDeploymentMenu}
                  loading={unpublishing}
                  onClick={() => {
                    setShowUnpublishDialog('production')
                  }}
                />
              )}
            />
          </tbody>
        </table>

        {isArchived(app) && <ArchivedRedirect />}

        {showPassphraseChanger &&
          <PassphraseChanger
            loading={settingPassphrase}
            handleSubmit={handlePassphraseSubmit}
            onClose={() => {
              setStagingHash(null)
              setShowPassphraseChanger(false)
            }}
          />
        }

        <PublishTipBanner
          iconStroke='pointLight'
          content={t('editor_page.publish_modal.hint.commit_picking')}
          showLearnMore
          url='https://8th.io/docs-publish'
        />

        {
        showUnpublishDialog && (
          <UnpublishBanner
            onConfirm={async () => {
              setUnpublishing(true)
              setShowUnpublishDialog(null)
              await undeployBranch(app.uuid, showUnpublishDialog)
              setUnpublishing(false)
            }}
            onCancel={() => setShowUnpublishDialog(null)}
          />
        )
      }

        <div className={classes.uiModal}>
          <PublishCommitTable
            newStagingHash={newStagingHash}
            newProductionHash={newProductionHash}
            handleVersionSelect={handleVersionSelect}
          />
          {showPublicProfileNotice &&
            <ColoredMessage
              className={`public-profile-notification margins ${themeName}`}
              color='blue'
                // eslint-disable-next-line local-rules/hardcoded-copy
              iconName='info circle'
              iconClass='info'
            >
              <span>
                {t('editor_page.publish_modal.cta.active_public_profile')}
              </span>
              <Link
                target='_blank'
                rel='noopener noreferrer'
                to={getPathForAccount(account, AccountPathEnum.publicProfile)}
                a8='click;cloud-editor-publish-flow;go-to-public-profile'
              >
                {t('editor_page.publish_modal.cta.go_to_public_profile')}
                {/* eslint-disable-next-line local-rules/hardcoded-copy */}
                <Icon alt='redirect' name='external' />
              </Link>
            </ColoredMessage>
            }
          {isUnsafe &&
            <StaticBanner
              type='warning'
              message={t('editor_page.publish_modal.unsafe_msg')}
            />
            }
        </div>
      </div>
    </PublishPageWrapper>
  )
}

export {
  PublishContent,
}
