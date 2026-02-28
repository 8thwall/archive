import React from 'react'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {createThemedStyles} from '../ui/theme'
import * as settings from '../static/styles/settings'
import type {IBrowseAccount, IBrowseApp, IDiscoveryAccount} from '../common/types/models'
import {getPublicPathForAccount, getPublicPathForApp} from '../common/paths'
import icons from '../apps/icons'
import {CheckedCertificateIcon} from './public-icons'
import {
  appHasPublicRepo, deriveAppCoverImageUrl, getDisplayNameForApp,
} from '../../shared/app-utils'
import {COVER_IMAGE_PREVIEW_SIZES} from '../../shared/app-constants'
import {is8thWallAccountUuid, isPartner} from '../../shared/account-utils'
import {bool, combine} from '../common/styles'

const useStyles = createThemedStyles(theme => ({
  projectCard: {
    'display': 'flex',
    'alignItems': 'center',
    'gap': '1em',

    '&:hover': {
      cursor: 'pointer',
    },
  },
  card: {
    position: 'relative',
    borderRadius: settings.cardBorderRadius,
    width: '8em',
    height: '4.2em',  // 8em * 0.525 (52.5%) to match the image's aspect ratio

    // When the image hasn't been load, the bottom left corner is the color-picked color
    // on our brand light background
    background: 'linear-gradient(45deg, #212122, transparent)',
  },
  coverImage: {
    display: 'block',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: settings.cardBorderRadius,
  },
  appInfo: {
    flex: '1',
    padding: '0.8em 0',
  },
  appName: {
    fontFamily: theme.subHeadingFontFamily,
    fontWeight: '700',
    lineHeight: '24px',
    color: theme.fgMain,

    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  accountContainer: {
    display: 'flex',
    columnGap: '0.3em',
    alignItems: 'center',
  },
  accountLink: {
    marginTop: '0.3em',
  },
  accountName: {
    fontFamily: settings.bodySanSerif,
    fontWeight: '500',
    fontSize: '12px',
    color: settings.gray4,
    margin: '0',
    lineHeight: '16px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  appIcons: {
    marginLeft: 'auto',
    paddingLeft: '1.1em',
    display: 'flex',
    columnGap: '0.7em',
    alignItems: 'center',
  },
  appClone: {
    backgroundColor: settings.gray1,
    height: '18px',
    borderRadius: '2px',
  },
  appTryout: {
    height: '18px',
  },
  darkTitle: {
    color: settings.brandWhite,
  },
  darkAccountName: {
    color: settings.gray3,
  },
  darkIcon: {
    background: 'none',
    filter: 'invert(0.8) saturate(0) brightness(2)',
  },
  darkCard: {
    boxShadow: 'none',
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

interface IProjectCardCondensed {
  account?: IBrowseAccount
  app: IBrowseApp
  pageName: string  // For a8
  showAgency?: boolean
  darkMode?: boolean
  customClickEvent?: Function
  showIcons?: boolean
}

const isDiscoveryAccount = (account: IBrowseApp['Account']): account is IDiscoveryAccount => (
  typeof account === 'object' && 'icon' in account
)

const ProjectCardCondensed: React.FC<IProjectCardCondensed> = ({
  account, app, pageName, showAgency = false, darkMode = false, customClickEvent = null,
  showIcons = true,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages'])

  const appAccount = account || (isDiscoveryAccount(app.Account) ? app.Account : null)
  const appPath = customClickEvent ? null : getPublicPathForApp(getShortName(account, app), app)

  const showCheckBadge = appAccount &&
    (isPartner(appAccount) || is8thWallAccountUuid(appAccount.uuid))

  const appIcons = (
    <div className={classes.appIcons}>
      {appHasPublicRepo(app) && app.productionCommitHash &&
        <img
          className={combine(classes.appClone, bool(darkMode, classes.darkIcon))}
          src={icons.projectClone}
          alt={t('project_library_page.icons.code_available')}
          title={t('project_library_page.icons.code_available')}
        />
      }
      {!app.featuredPreviewDisabled && app.productionCommitHash &&
        <img
          className={classes.appTryout}
          src={darkMode ? icons.projectTryOutWhite : icons.projectTryOut}
          alt={t('project_library_page.icons.try_it_out_available')}
          title={t('project_library_page.icons.try_it_out_available')}
        />
      }
    </div>
  )

  return (
    <div className={classes.projectCard}>
      <div className={combine(classes.card, bool(darkMode, classes.darkCard))}>
        {customClickEvent
          ? (
            <div
              a8={`click;${pageName};click-condensed-project-card-${app.appName}`}
              role='button'
              tabIndex={0}
              onClick={() => customClickEvent(app.uuid)}
              onKeyDown={() => customClickEvent(app.uuid)}
            >
              <img
                className={classes.coverImage}
                draggable={false}
                src={deriveAppCoverImageUrl(app, COVER_IMAGE_PREVIEW_SIZES[600])}
                alt={getDisplayNameForApp(app)}
              />
            </div>
          )
          : (
            <Link
              to={appPath}
              a8={`click;${pageName};click-condensed-project-card-${app.appName}`}
            >
              <img
                className={classes.coverImage}
                draggable={false}
                src={deriveAppCoverImageUrl(app, COVER_IMAGE_PREVIEW_SIZES[600])}
                alt={getDisplayNameForApp(app)}
              />
            </Link>
          )}
      </div>

      <div className={classes.appInfo}>
        {customClickEvent
          ? (
            <div
              role='button'
              tabIndex={0}
              onClick={() => customClickEvent(app.uuid)}
              onKeyDown={() => customClickEvent(app.uuid)}
            >
              <p
                className={combine(classes.appName, bool(darkMode, classes.darkTitle))}
                title={getDisplayNameForApp(app)}
              >
                {getDisplayNameForApp(app)}
              </p>
            </div>
          )
          : (
            <Link
              to={appPath}
              a8={`click;${pageName};click-condensed-project-card-${app.appName}`}
            >
              <p
                className={combine(classes.appName, bool(darkMode, classes.darkTitle))}
                title={getDisplayNameForApp(app)}
              >
                {getDisplayNameForApp(app)}
              </p>
            </Link>
          )}
        {showAgency && appAccount &&
          <div className={classes.accountContainer}>
            <Link
              className={classes.accountLink}
              to={getPublicPathForAccount(appAccount)}
            >
              <p
                className={combine(classes.accountName,
                  bool(darkMode, classes.darkAccountName))}
                title={appAccount.name}
              >
                {appAccount.name}
              </p>
            </Link>
            {showCheckBadge && showIcons && <CheckedCertificateIcon height={1} />}
            {showIcons && !BuildIf.PROJECT_LIBRARY_REVAMP_20250929 && appIcons}
          </div>
        }
      </div>

      {!showAgency && showIcons && appIcons}
    </div>
  )
}

export default ProjectCardCondensed
