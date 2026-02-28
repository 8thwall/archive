import * as React from 'react'
import {join} from 'path'
import spdxLicenseList from 'spdx-license-list'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {AccountPathEnum, getPathForAppNoTrailing} from '../common/paths'
import publicBrowseAction from './public-browse-actions'
import {
  appHasPublicRepo, deriveAppCoverImageUrl, getDisplayNameForApp,
  isCloudStudioApp, is8thWallHosted,
} from '../../shared/app-utils'
import {COVER_IMAGE_PREVIEW_SIZES} from '../../shared/app-constants'

import ProjectShare from './project-share'
import type {IPublicAccount, IPublicApp} from '../common/types/models'
import {Badge} from '../ui/components/badge'
import {
  tinyViewOverride,
  tinyWidthBreakpoint,
} from '../static/styles/settings'
import useActions from '../common/use-actions'

import ProfileAvatarBlock from './widgets/profile-avatar-block'
import BrowseLink from './widgets/browse-link'
import {LoadingImage} from '../uiWidgets/loading-image'
import {Tooltip} from '../ui/components/tooltip'
import {PrimaryButton} from '../ui/components/primary-button'
import {StandardContainer} from '../ui/components/standard-container'
import {SpaceBetween} from '../ui/layout/space-between'
import {SecondaryButton} from '../ui/components/secondary-button'
import {Icon} from '../ui/components/icon'
import AutoHeading from '../widgets/auto-heading'
import {SrOnly} from '../ui/components/sr-only'
import {RequireLoginModal} from '../uiWidgets/require-login-modal'
import {useUserHasSession} from '../user/use-current-user'
import {Embed8Button} from '../widgets/embed8-button'

const useStyles = createUseStyles({
  publicBrowseAppInfo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    alignItems: 'start',
    [tinyViewOverride]: {
      gridTemplateColumns: '1fr',
      gap: '1rem',
    },
  },
  image: {
    width: '100%',
    aspectRatio: '600 / 315',
    objectFit: 'cover',
    borderRadius: '0.5em',
  },
  appTitle: {
    margin: 0,
  },
  playButton: {
    width: '115px',
  },
})

interface IPublicBrowseAppInfo {
  app: IPublicApp
  account: IPublicAccount
  onCloneClick: () => void
}

const PublicBrowseAppInfo: React.FC<IPublicBrowseAppInfo> = ({
  app, account, onCloneClick,
}) => {
  const {fetchPreviewShortLink} = useActions(publicBrowseAction)

  const onShareClick = (title: string, url: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.share({
        title,
        url,
      })
    }
  }

  const appTitle = getDisplayNameForApp(app)
  const appLicenseName = spdxLicenseList[app.repoLicenseProd]?.name
  // Checks if app license type is APP.
  const shareUrl = typeof window !== 'undefined' && window.location
    ? `${window.location.origin}${getPathForAppNoTrailing(account, app)}`
    : ''

  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages', 'common'])
  const mediumAppCoverUri = deriveAppCoverImageUrl(app, COVER_IMAGE_PREVIEW_SIZES[600])
  const smallAppCoverUri = deriveAppCoverImageUrl(app, COVER_IMAGE_PREVIEW_SIZES[400])
  const mediumAppCoverSrc = `${mediumAppCoverUri} ${COVER_IMAGE_PREVIEW_SIZES[600][0]}w`
  const smallAppCoverSrc = `${smallAppCoverUri} ${COVER_IMAGE_PREVIEW_SIZES[400][0]}w`
  const mediaCondition = `(max-width: ${tinyWidthBreakpoint})`
  const isLoggedIn = useUserHasSession()

  const isCodeVisible = appHasPublicRepo(app) && app.productionCommitHash

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  // When the button is used as a popup trigger it doesn't need a click handler.
  const shareAction = hasNativeShare ? () => onShareClick(appTitle, shareUrl) : undefined

  const projectBadge = app.hostingType === 'CLOUD_STUDIO'
    ? t('project_library_page.badge.cloud_studio')
    : t('project_library_page.badge.cloud_editor')

  const shareButton = (
    <SecondaryButton
      type='button'
      onClick={shareAction}
      a8={`click;public-project;click-share-${app.appName}`}
    >
      <Icon stroke='share' />
      <SrOnly>{t('button.share_project', {ns: 'common'})}</SrOnly>
    </SecondaryButton>
  )

  const cloneButton = (
    isLoggedIn
      ? (
        <PrimaryButton
          a8={`click;public-project;click-clone-project-${app.appName}`}
          spacing='wide'
          onClick={onCloneClick}
        >
          {t('button.clone_project', {ns: 'common'})}
        </PrimaryButton>
      )
      : (
        <RequireLoginModal
          trigger={(
            <PrimaryButton
              a8={`click;public-project;click-clone-project-${app.appName}`}
              spacing='wide'
              onClick={null}
            >
              {t('button.clone_project', {ns: 'common'})}
            </PrimaryButton>
          )}
          type='project'
          redirectTo={
            join('/', AccountPathEnum.duplicateProject, getPathForAppNoTrailing(account, app))
          }
          a8Data={{
            event: 'click',
            category: 'public-project',
            action: 'clone-popup',
            appName: app.appName,
          }}
        />
      )

  )

  const additionalAppInfo = (
    <SpaceBetween direction='vertical'>
      <SpaceBetween>
        {isCodeVisible && cloneButton}
        {!app.featuredPreviewDisabled && app.productionCommitHash &&
          <div className={classes.playButton}>
            <Embed8Button
              a8={`click;public-project;click-try-it-out-${app.appName}`}
              shortLinkProvider={() => fetchPreviewShortLink(app.uuid)}
            >
              {t('button.play', {ns: 'common'})}
            </Embed8Button>
          </div>
          }
        {hasNativeShare
          ? (
            shareButton
          )
          : (
            <ProjectShare
              app={app}
              account={account}
              url={shareUrl}
              trigger={shareButton}
              a8={`click;public-project;click-share-${app.appName}`}
            />
          )}
      </SpaceBetween>
      {app.appDescription && <p className='description'>{app.appDescription}</p>}
      {isCodeVisible && appLicenseName &&
        <SpaceBetween>
          <BrowseLink path='LICENSE'>
            <Icon
              stroke='fileAlternate'
            />
            {appLicenseName}
          </BrowseLink>
        </SpaceBetween>
      }
    </SpaceBetween>
  )

  const renderAppTitleRow = () => {
    if (is8thWallHosted(app) && isCodeVisible) {
      return (
        <SpaceBetween between>
          <AutoHeading className={classes.appTitle}>{appTitle}</AutoHeading>
          <Tooltip
            content={isCloudStudioApp(app)
              ? t('project_library_page.tooltip.studio_badge')
              : t('project_library_page.tooltip.editor_badge')}
            position='top'
          >
            <Badge color={isCloudStudioApp(app) ? 'purple' : 'blue'} variant='pastel'>
              {projectBadge}
            </Badge>
          </Tooltip>
        </SpaceBetween>
      )
    } else {
      return <AutoHeading className={classes.appTitle}>{appTitle}</AutoHeading>
    }
  }

  return (
    <div className={classes.publicBrowseAppInfo}>
      <LoadingImage
        srcSet={[mediumAppCoverSrc, smallAppCoverSrc].join()}
        sizes={`${mediaCondition} ${COVER_IMAGE_PREVIEW_SIZES[400][1]}px`}
        width={COVER_IMAGE_PREVIEW_SIZES[400][1]}
        src={mediumAppCoverUri}
        alt={t('featured_app_page.cover_image.alt')}
        className={classes.image}
      />
      <StandardContainer padding='small' overflow>
        <SpaceBetween direction='vertical'>
          {renderAppTitleRow()}
          <ProfileAvatarBlock account={account} />
          {additionalAppInfo}
        </SpaceBetween>
      </StandardContainer>
    </div>
  )
}

export default PublicBrowseAppInfo
