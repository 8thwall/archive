import React from 'react'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {createThemedStyles} from '../ui/theme'
import type {IBrowseAccount, IBrowseApp, IDiscoveryAccount} from '../common/types/models'
import {getPublicPathForAccount, getPublicPathForApp} from '../common/paths'
import {deriveAppCoverImageUrl, getDisplayNameForApp} from '../../shared/app-utils'
import {COVER_IMAGE_PREVIEW_SIZES} from '../../shared/app-constants'
import ResponsiveImage from '../common/responsive-image'
import {responsiveAccountIcons} from '../../shared/responsive-account-icons'
import {Embed8Button} from '../widgets/embed8-button'
import useActions from '../common/use-actions'
import publicBrowseAction from './public-browse-actions'
import {combine} from '../common/styles'

const useStyles = createThemedStyles(theme => ({
  projectCard: {
    'border': `1px solid ${theme.mainDivider}`,
    'borderRadius': '16px',
    'transition': 'background 0.3s',
    'padding': '8px',
    'paddingBottom': '12px',
    'display': 'flex',
    'flexDirection': 'column',
    'alignItems': 'stretch',
    'minWidth': 0,

    '&:hover': {
      cursor: 'pointer',
      background: theme.bgMuted,
    },
  },
  projectCardWithCtas: {
    '&:hover': {
      cursor: 'unset',
      background: 'none',
    },
  },
  coverImage: {
    width: '100%',
    borderRadius: '0.5em',
    aspectRatio: '40/21',
    objectFit: 'cover',
  },
  appInfo: {
    display: 'flex',
    marginTop: '12px',
    padding: '0 4px',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  accountLogoContainer: {
    paddingRight: '12px',
    display: 'flex',
    alignItems: 'center',
  },
  accountLogo: {
    width: '24px',
    height: '24px',
    objectFit: 'cover',
    border: `1px solid ${theme.appCardBorder}`,
    borderRadius: '6px',
  },
  appText: {
    alignSelf: 'center',
    overflow: 'hidden',
    flex: '2 1 auto',
    maxWidth: '100%',
  },
  appName: {
    fontFamily: theme.subHeadingFontFamily,
    fontSize: '1em',
    fontWeight: '600',
    lineHeight: '20px',
    margin: 0,
    color: theme.fgMain,

    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  accountName: {
    'marginTop': '4px',
    'overflow': 'hidden',
    'textOverflow': 'ellipsis',
    '& > a': {
      'fontFamily': theme.bodyFontFamily,
      'fontSize': '12px',
      'lineHeight': '16px',
      'whiteSpace': 'nowrap',
      'color': theme.fgMuted,
      'textDecoration': 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  appDescription: {
    fontFamily: theme.subHeadingFontFamily,
    fontSize: '1em',
    height: '60px',
    lineHeight: '20px',
    color: theme.fgMuted,
    marginTop: '12px',
    marginBottom: 0,

    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  ctaContainer: {
    'display': 'flex',
    'gap': '8px',
    'justifyContent': 'space-between',
    'marginTop': '12px',
    '& > *': {
      flex: 1,
      minWidth: 0,
    },
  },
  cta: {
    'display': 'flex',
    'border': 'none',
    'borderRadius': '10px',
    'justifyContent': 'center',
    'alignItems': 'center',
    'padding': 0,
    'background': theme.secondaryBtnBg,
    'boxShadow': `${theme.secondaryBtnBoxShadow} !important`,
    'fontFamily': theme.bodyFontFamily,
    'color': theme.fgMain,
    'fontWeight': '600',
    'fontSize': '14px',
    'lineHeight': '20px',
    'height': '40px',
    '&:hover': {
      color: theme.fgMain,
      background: theme.secondaryBtnHoverBg,
    },
  },
  tagContainer: {
    'width': '100%',
    'height': '20px',
    'overflow': 'scroll',
    'display': 'flex',
    'flexDirection': 'row',
    'flexWrap': 'nowrap',
    'gap': '4px',
    'marginTop': '12px',
    'marginBottom': 0,
    'padding': 0,

    'scrollbarWidth': 'none',
    '-ms-overflow-style': 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  tag: {
    'fontSize': '12px',
    'fontFamily': theme.bodyFontFamily,
    'lineHeight': '16px',
    'boxSizing': 'border-box',
    'padding': '1px 4px',
    'color': theme.fgMuted,
    'background': theme.tagBg,
    'border': `1px solid ${theme.sfcBorderDefault}`,
    'borderRadius': '4px',
    'whiteSpace': 'nowrap',

    '&:hover': {
      color: theme.fgMain,
      background: theme.tagHoverBg,
      textDecoration: 'none',
    },
  },
}))

const getShortName = (account: IBrowseAccount | null, app: IBrowseApp): string => {
  if (account) {
    return account.shortName
  }

  if (!app.Account) {
    throw new Error('Passed IBrowseAccount without account')
  }

  if (typeof app.Account === 'string') {
    throw new Error('Passed normalized IPublicApp without IPublicAccount')
  }

  return app.Account.shortName
}

interface IProjectCard {
  account?: IBrowseAccount
  app: IBrowseApp
  pageName: string  // For a8
  customClickEvent?: Function
  showAgency?: boolean
  showIcons?: boolean
  showAccountName?: boolean
  showDescription?: boolean
  showCTAs?: boolean
  showTags?: boolean
  getTagUrl?: (tagName: string) => string
}

const isDiscoveryAccount = (account: IBrowseApp['Account']): account is IDiscoveryAccount => (
  typeof account === 'object' && 'icon' in account
)

const ProjectCard: React.FC<IProjectCard> = ({
  account,
  app,
  pageName,
  customClickEvent = null,
  showAgency = false,
  showIcons = true,
  showAccountName = true,
  showDescription = false,
  showCTAs = false,
  showTags = false,
  getTagUrl,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages'])
  const appAccount = account || (isDiscoveryAccount(app.Account) ? app.Account : null)
  const appPath = customClickEvent ? null : getPublicPathForApp(getShortName(account, app), app)
  const description = 'appDescription' in app ? app.appDescription : null
  const {fetchPreviewShortLink} = useActions(publicBrowseAction)
  const tags = ('AppTags' in app && Array.isArray(app.AppTags)) ? app.AppTags : []

  const cardContent = (
    <>
      <img
        className={classes.coverImage}
        draggable={false}
        src={deriveAppCoverImageUrl(app, COVER_IMAGE_PREVIEW_SIZES[600])}
        alt={getDisplayNameForApp(app)}
        decoding='async'
        loading='lazy'
      />
      <div className={classes.appInfo}>
        {showAgency && showIcons && appAccount &&
          <Link
            className={classes.accountLogoContainer}
            to={getPublicPathForAccount(appAccount)}
          >
            <ResponsiveImage
              className={classes.accountLogo}
              width={24}
              alt={`${appAccount.name} Logo`}
              sizeSet={responsiveAccountIcons(appAccount)}
            />
          </Link>
        }
        <div className={classes.appText}>
          <p
            className={classes.appName}
            title={getDisplayNameForApp(app)}
          >
            {getDisplayNameForApp(app)}
          </p>
          {showAgency && showAccountName && appAccount &&
            <div className={classes.accountName}>
              <Link to={getPublicPathForAccount(appAccount)}>
                by&nbsp;{appAccount.name}
              </Link>
            </div>
          }
        </div>
      </div>
      {showDescription &&
        <p
          className={classes.appDescription}
          title={description}
        >
          {description}
        </p>
      }
      {showCTAs &&
        <div className={classes.ctaContainer}>
          <Link
            className={classes.cta}
            to={appPath}
            a8={`click;${pageName};click-view-project-${app.appName}`}
          >
            {t('project_card.button.view_project')}
          </Link>
          {!app.featuredPreviewDisabled && app.productionCommitHash &&
            <Embed8Button
              a8={`click;${pageName};click-play-now-${app.appName}`}
              shortLinkProvider={() => fetchPreviewShortLink(app.uuid)}
            >
              {t('project_card.button.play_now')}
            </Embed8Button>
          }
        </div>
      }
      {showTags &&
        <div className={classes.tagContainer}>
          {tags.map(tag => (
            <Link
              className={classes.tag}
              key={tag.name}
              to={getTagUrl?.(tag.name)}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      }
    </>
  )

  if (customClickEvent) {
    return (
      <div
        className={classes.projectCard}
        a8={`click;${pageName};click-project-card-${app.appName}`}
        role='button'
        tabIndex={0}
        onClick={() => customClickEvent(app.uuid)}
        onKeyDown={(e) => {
          // eslint-disable-next-line local-rules/hardcoded-copy
          if (e.key === 'Enter' || e.key === ' ') {
            customClickEvent(app.uuid)
          }
        }}
      >
        {cardContent}
      </div>
    )
  } else if (showCTAs) {
    return (
      <div className={combine(classes.projectCard, classes.projectCardWithCtas)}>
        {cardContent}
      </div>
    )
  } else {
    return (
      <Link
        className={classes.projectCard}
        to={appPath}
        a8={`click;${pageName};click-project-card-${app.appName}`}
      >
        {cardContent}
      </Link>
    )
  }
}

export default ProjectCard
