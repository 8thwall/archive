import React, {useState} from 'react'
import {Button} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {Link} from 'react-router-dom'
import {useTranslation, Trans} from 'react-i18next'

import Page from '../widgets/page'
import useCurrentAccount from '../common/use-current-account'
import useCurrentApp from '../common/use-current-app'
import ErrorMessage from '../home/error-message'
import WorkspaceCrumbHeading from '../widgets/workspace-crumb-heading'
import ShowcaseThisProject from './widgets/showcase-this-project-section'
import ShowcaseSettings from './settings/showcase-settings'
import useStyles from './showcase-project-jss'
import ColoredMessage from '../messages/colored-message'
import {brandBlack, brandPurple} from '../static/styles/settings'
import {combine} from '../common/styles'
import {AccountPathEnum, getPathForAccount, getPublicPathForApp} from '../common/paths'
import {
  isShowcaseSettingsEnabled, isEntryWebAccount,
} from '../../shared/account-utils'
import {
  appHasPublicRepo, isBasicInfoCompleted, isEntryWebApp,
} from '../../shared/app-utils'
import ShowcaseSettingsContext from './settings/showcase-settings-context'
import type {IFeaturedAppImage} from '../common/types/models'
import type {IFeaturedAppFields} from './settings/featured-app-fields'
import {getFullVideoUrl} from '../../shared/featured-video'
import sparkles from '../static/sparkles_grey.svg'
import useAppSharingInfo from '../common/use-app-sharing-info'

const getTagStrings = tags => tags.map(tag => tag.name)

const getFeaturedTagStrings = (featuredTags) => {
  if (featuredTags) {
    return featuredTags.map(featuredTag => featuredTag.name)
  } else {
    return []
  }
}

const messageUseStyles = createUseStyles({
  purpleMessage: {
    color: brandPurple,
  },
  marginTop: {
    marginTop: '3em',
  },
  marginBottom: {
    marginBottom: '1.5em',
  },
  icon: {
    fontSize: '1em !important',
    width: '1em !important',
  },
  link: {
    color: brandBlack,
    textDecoration: 'underline',
    fontWeight: '700',
  },
})

const CrossAccountRestricted = () => {
  const {t} = useTranslation('app-pages')
  const classes = useStyles()
  return (
    <div className={classes.crossAccountContainer}>
      <img
        alt='sparkles'
        src={sparkles}
        className={classes.crossAccountImage}
        draggable={false}
      />
      <div className={classes.crossAccountHeading}>
        {t('feature_project_page.restricted_to_owners')}
      </div>
    </div>
  )
}

const ShowcaseProjectPage = () => {
  const {t} = useTranslation('app-pages')
  const classes = useStyles()
  const messageClasses = messageUseStyles()
  const account = useCurrentAccount()
  const app = useCurrentApp()
  const isAppEntryWebApp = isEntryWebApp(account, app)
  const [recentUnpublished, setRecentUnpublished] = useState(false)
  const [showPublishSuccessful, setShowPublishSuccessful] = useState(false)
  const [featuredDescription, setFeaturedDescription] = useState('')
  const [restrictedTags, setRestrictedTags] = useState([])
  const [suggestedTags, setSuggestedTags] = useState([])
  const [featuredTagStrings, setFeaturedTagStrings] =
    useState(getFeaturedTagStrings(app.AppTags?.filter(tag => !tag.restricted)))
  const [isTryable, setIsTryable] = useState(!app.featuredPreviewDisabled)  // Default true
  // TODO(wayne): Check the best way to set the default true
  const [isCloneable, setIsCloneable] = useState(appHasPublicRepo(app))
  const [featuredVideoUrl, setFeaturedVideoUrl] = useState(getFullVideoUrl(app.featuredVideoUrl))
  const [featuredAppImages, setFeaturedAppImages] = useState(app.FeaturedAppImages || [])
  const [featuredDescriptionIsLoading, setFeaturedDescriptionIsLoading] = useState(true)
  const [featuredAppImageIsUploading, setFeaturedAppImageIsUploading] = useState(false)
  const [
    deletedFeaturedAppImages, setDeletedFeaturedAppImages,
  ] = useState<readonly IFeaturedAppImage[]>([])
  const [publishedFormState, setPublishedFormState] = useState({} as IFeaturedAppFields)
  const [errorMessage, setErrorMessage] = useState<string>()
  const {isExternalApp} = useAppSharingInfo(app)

  const clearMessages = () => {
    setRecentUnpublished(false)
    setShowPublishSuccessful(false)
  }

  const showMissingCta = [
    !featuredAppImages.length,
    !featuredTagStrings.length,
    !featuredDescriptionIsLoading && !featuredDescription,
    !isBasicInfoCompleted(app),
  ].some(Boolean)

  const requireFieldMissingCTA = (
    <ColoredMessage
      color='blue'
      iconName='info circle'
      iconClass={messageClasses.icon}
      className={messageClasses.marginTop}
    >
      {t('feature_project_page.colored_message.required_missing_cta')}
    </ColoredMessage>
  )

  const unpublishedMessage = (
    <ColoredMessage
      color='purple'
      iconName='check circle outline'
      iconClass={messageClasses.icon}
      className={combine(messageClasses.purpleMessage, messageClasses.marginBottom)}
    >
      {t('feature_project_page.colored_message.unpublished_project')}
    </ColoredMessage>
  )
  const upgradeAccountCTA = (
    <ColoredMessage
      color='blue'
      iconName='info circle'
      iconClass={messageClasses.icon}
      className={messageClasses.marginBottom}
    >
      {isShowcaseSettingsEnabled(account) &&
        <Trans
          ns='app-pages'
          i18nKey='feature_project_page.colored_message.upgrade_to_publish'
        >
          To publish this project you need to upgrade your plan. Upgrade now in your
          <Link
            className={messageClasses.link}
            to={getPathForAccount(account, AccountPathEnum.account)}
          >
            Account Settings
          </Link>.
        </Trans>
      }
      {!isShowcaseSettingsEnabled(account) &&
        <Trans
          ns='app-pages'
          i18nKey='feature_project_page.colored_message.upgrade_to_feature'
        >
          To feature this project you need to upgrade your plan. Upgrade now in your
          <Link
            className={messageClasses.link}
            to={getPathForAccount(account, AccountPathEnum.account)}
          >
            Account Settings
          </Link>.
        </Trans>
      }
    </ColoredMessage>
  )

  const publishSuccessMessage = (
    <ColoredMessage
      color='purple'
      className={combine(messageClasses.purpleMessage, messageClasses.marginBottom)}
      iconClass={messageClasses.icon}
      iconName='check circle outline'
    >
      {t('feature_project_page.colored_message.success_featured')}
    </ColoredMessage>
  )

  const settingsContext = {
    featuredVideoUrl,
    setFeaturedVideoUrl,
    featuredAppImages,
    setFeaturedAppImages,
    featuredDescription,
    setFeaturedDescription,
    featuredDescriptionIsLoading,
    setFeaturedDescriptionIsLoading,
    featuredTagStrings,
    setFeaturedTagStrings,
    restrictedTags: getTagStrings(restrictedTags),
    suggestedTags: getTagStrings(suggestedTags),
    setRestrictedTags,
    setSuggestedTags,
    featuredAppImageIsUploading,
    setFeaturedAppImageIsUploading,
    deletedFeaturedAppImages,
    setDeletedFeaturedAppImages,
    isTryable,
    setIsTryable,
    isCloneable,
    setIsCloneable,
    publishedFormState,
    setPublishedFormState,
    errorMessage,
    setErrorMessage,
  }
  // Remove footer to have enough margin at the bottom for the last settings box
  return (
    <Page hasFooter={false} headerVariant='workspace'>
      <ShowcaseSettingsContext.Provider value={settingsContext}>
        <WorkspaceCrumbHeading
          text={t('feature_project_page.heading')}
          account={account}
          app={app}
        />
        <ErrorMessage />
        {isExternalApp && <CrossAccountRestricted /> }
        {!isExternalApp && isShowcaseSettingsEnabled(account) &&
          <>
            <div className={classes.viewFeaturedProjectBtn}>
              {!isEntryWebAccount(account) &&
                <Button
                  primary
                  disabled={!app.publicFeatured}
                  color='purple'
                  content={t('feature_project_page.button.view_featured_project')}
                  as={Link}
                  to={getPublicPathForApp(account, app)}
                  target='_blank'
                  rel='noopener noreferrer'
                />
                }
            </div>
            {recentUnpublished && unpublishedMessage}
            {showPublishSuccessful && publishSuccessMessage}
            <ShowcaseThisProject
              className={classes.showcaseThisProject}
              account={account}
              app={app}
            />
            {!isAppEntryWebApp && showMissingCta && requireFieldMissingCTA}
            <ShowcaseSettings
              onUnpublish={() => {
                clearMessages()
                setRecentUnpublished(true)
              }}
              account={account}
              app={app}
              onPublishComplete={() => {
                clearMessages()
                setShowPublishSuccessful(true)
              }}
            />
          </>
        }
        {!isExternalApp && !isShowcaseSettingsEnabled(account) && upgradeAccountCTA}
      </ShowcaseSettingsContext.Provider>
    </Page>
  )
}

export default ShowcaseProjectPage
