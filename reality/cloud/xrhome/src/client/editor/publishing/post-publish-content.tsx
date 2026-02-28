import React from 'react'
import {useTranslation} from 'react-i18next'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import {createThemedStyles} from '../../ui/theme'
import {brandWhite, brandHighlight, lightBlue, mango} from '../../static/styles/settings'
import useCurrentAccount from '../../common/use-current-account'
import useCurrentApp from '../../common/use-current-app'
import {combine} from '../../common/styles'
import {generateProjectUrl} from '../../../shared/app-utils'
import {makeHostedProductionUrl, withoutHttps} from '../../../shared/hosting-urls'
import {Icon, IconStroke} from '../../ui/components/icon'
import {hexColorWithAlpha} from '../../../shared/colors'
import {MILLISECONDS_PER_SECOND} from '../../../shared/time-utils'
import {isStarter} from '../../../shared/account-utils'
import {PublishPageWrapper} from './publish-page-wrapper'

const DELAY_IN_MILLISECONDS = 3 * MILLISECONDS_PER_SECOND

const useStyles = createThemedStyles(theme => ({
  postPublishContentContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: '2em',
  },
  socialContainer: {
    background:
      // eslint-disable-next-line max-len
      `linear-gradient(to top, ${hexColorWithAlpha(theme.publishModalBg, 0)} 0%, ${hexColorWithAlpha(theme.publishModalBg, 1)} 65%),
      linear-gradient(90deg, ${lightBlue} 0%, ${brandHighlight} 30%, #BD4ED0 60%, ${mango} 100%)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5em',
    borderRadius: '1em',
    padding: '2em',
    maxWidth: '80%',
    width: '100%',
  },
  socialLinkRow: {
    display: 'flex',
    gap: '1.5em',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  newLink: {
    'justifyContent': 'center',
    'background': hexColorWithAlpha('#000000', 0.35),
    '& > *': {
      'color': brandWhite,
      'alignSelf': 'center',
    },
    '& > a': {
      fontStyle: 'italic',
    },
  },
  socialLink: {
    height: '3em',
    width: '3em',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  directLink: {
    display: 'flex',
    gap: '0.5em',
    padding: '0.75em 2em',
    borderRadius: '2em',
    maxWidth: '30em',
  },
  directLinkText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  enlargeIcon: {
    '& > svg': {
      width: '20px',
      height: '20px',
    },
  },
  coverImage: {
    height: '12em',
    objectFit: 'fill',
    borderRadius: '0.5em',
    backgroundColor: '#ccc',
  },
  projectTitle: {
    fontSize: '1.2em',
    fontWeight: 600,
    color: brandWhite,
    marginTop: '0.5em',
    marginBottom: '0.5em',
    textAlign: 'center',
  },
}))

interface ISocialIcon {
  url?: string
  isCopyButton?: boolean
  stroke: IconStroke
  isEnlarged?: boolean
  openNewTab?: boolean
}

const SocialIcon: React.FC<ISocialIcon> = ({
  url, isCopyButton, stroke, isEnlarged, openNewTab,
}) => {
  const classes = useStyles()
  const [isPublicProfileUrlCopied, setIsPublicProfileUrlCopied] = React.useState(false)

  React.useEffect(() => {
    let timer
    if (isPublicProfileUrlCopied) {
      timer = setTimeout(() => setIsPublicProfileUrlCopied(false), DELAY_IN_MILLISECONDS)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [isPublicProfileUrlCopied])

  return (
    (isCopyButton
      ? (
        <CopyToClipboard text={url} onCopy={() => setIsPublicProfileUrlCopied(true)}>
          <button
            type='button'
            className={combine('style-reset', classes.newLink, classes.socialLink,
              isEnlarged && classes.enlargeIcon)}
          >
            <Icon stroke={isPublicProfileUrlCopied ? 'checkmark' : stroke} />
          </button>
        </CopyToClipboard>
      )
      : (
        <a
          type='button'
          href={url}
          target={openNewTab ? '_blank' : '_self'}
          className={combine('style-reset', classes.newLink, classes.socialLink,
            isEnlarged && classes.enlargeIcon)}
          rel='noreferrer'
        >
          <Icon stroke={stroke} />
        </a>
      ))
  )
}

const generateUtmUrl = (
  url: string,
  utmSource: string,
  utmMedium?: string
) => encodeURIComponent(`${url}?utm_source=${utmSource}&utm_medium=${utmMedium || 'website'}`)

const PostPublishContent: React.FC = () => {
  const classes = useStyles()
  const account = useCurrentAccount()
  const app = useCurrentApp()
  const {t} = useTranslation(['cloud-editor-pages'])

  const projectPageLink = isStarter(account)
    ? generateProjectUrl(app, account)
    : makeHostedProductionUrl(account.shortName, app.appName)

  return (
    <PublishPageWrapper
      headline={t('editor_page.native_publish_modal.online_publish_share_headline')}
      headlineType='web'
    >
      <div className={classes.postPublishContentContainer}>
        <div className={classes.socialContainer}>
          {app.coverImageUrl && (
            <img
              src={app.coverImageUrl}
            // eslint-disable-next-line local-rules/hardcoded-copy
              alt='Cover'
              className={classes.coverImage}
            />
          )}
          <div className={classes.projectTitle}>
            {app.appTitle || app.appName}
          </div>
          <div className={classes.socialLinkRow}>
            <SocialIcon
              url={projectPageLink}
              stroke='link'
              isCopyButton
            />
            <SocialIcon
              url={`https://twitter.com/intent/tweet?url=${
                generateUtmUrl(projectPageLink, 'twitter')
              }&text=${t('editor_page.post_publish_modal.copy.twitter')}`}
              stroke='socialX'
              openNewTab
            />
            <SocialIcon
              url={`http://www.linkedin.com/shareArticle?mini=true&url=${
                generateUtmUrl(projectPageLink, 'linkedin')
              }&text=${t('editor_page.post_publish_modal.copy.linkedin')}`}
              stroke='socialLinkedIn'
              openNewTab
            />
            <SocialIcon
              url={`https://www.facebook.com/sharer/sharer.php?u=${
                generateUtmUrl(projectPageLink, 'facebook')
              }`}
              stroke='socialFacebook'
              isEnlarged
              openNewTab
            />
            <SocialIcon
              url={`mailto:?body=${t('editor_page.post_publish_modal.copy.email')} ${
                generateUtmUrl(projectPageLink, 'email')}`}
              stroke='email'
            />
            <SocialIcon
              url={`http://www.reddit.com/submit?url=${
                generateUtmUrl(projectPageLink, 'reddit')
              }&title=${t('editor_page.post_publish_modal.copy.reddit')}`}
              stroke='socialReddit'
              isEnlarged
              openNewTab
            />
          </div>
          <a
            href={projectPageLink}
            className={combine(classes.newLink, classes.directLink)}
            target='_blank'
            rel='noreferrer'
            a8='click;cloud-editor-publish-flow;final-publish-congrats-project-link'
          >
            <Icon stroke='popOut' />
            <span className={classes.directLinkText}>
              {withoutHttps(
                projectPageLink.endsWith('/') ? projectPageLink.slice(0, -1) : projectPageLink
              )}
            </span>
          </a>
        </div>
      </div>
    </PublishPageWrapper>
  )
}

export {PostPublishContent}
