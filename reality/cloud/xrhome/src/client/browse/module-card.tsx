import React from 'react'
import {Link} from 'react-router-dom'

import * as settings from '../static/styles/settings'
import type {IAccount, IBrowseModule, IPublicAccount} from '../common/types/models'
import {getPublicPathForAccount, getPublicPathForModule} from '../common/paths'
import {CheckedCertificateIcon} from './public-icons'
import {COVER_IMAGE_PREVIEW_SIZES} from '../../shared/module/module-constants'
import {is8thWallAccountUuid, isPartner} from '../../shared/account-utils'
import ResponsiveImage from '../common/responsive-image'
import {responsiveAccountIcons} from '../../shared/responsive-account-icons'
import {deriveModuleCoverImageUrl} from '../../shared/module-cover-image'
import {getDisplayNameForModule} from '../../shared/module/module-display-name'
import {createThemedStyles} from '../ui/theme'
import icons from '../apps/icons'

const BOX_SHADOW = `
  0 4px ${settings.cardShadowBlur} ${settings.cardShadowSpread} ${settings.cardShadowColor}
`

const useStyles = createThemedStyles(theme => ({
  'moduleCard': {
    'minWidth': '0',

    '&:hover $card': {
      top: '-4px',
    },
    '&:hover': {
      cursor: 'pointer',
    },
  },
  'card': {
    'position': 'relative',
    'borderRadius': settings.cardBorderRadius,

    // When the image hasn't been load, the bottom left corner is the color-picked color
    // on our brand light background
    'background': 'linear-gradient(45deg, #212122, transparent)',

    // This makes sure the card has the same aspect ratio as our image
    'height': '0',
    'paddingTop': settings.cardImageRatio,

    'transition': '0.15s top',
    'top': '0',
    'boxShadow': BOX_SHADOW,
  },
  'coverImage': {
    display: 'block',
    position: 'absolute',
    top: '0',
    width: '100%',
    borderRadius: settings.cardBorderRadius,
  },
  'moduleInfo': {
    'display': 'flex',
    'padding': '0.8em 0.3em 0 0.3em',
    'justifyContent': 'space-between',
    'overflow': 'hidden',
  },
  'accountLogoContainer': {
    'paddingRight': '0.5em',
    'display': 'flex',
    'alignItems': 'center',
  },
  'accountLogo': {
    'objectFit': 'cover',
    'border': '1px solid',
    'borderRadius': '50%',
    'borderColor': settings.gray2,
  },
  'moduleText': {
    'alignSelf': 'center',
    'overflow': 'hidden',
    'flex': '2 1 auto',
    'maxWidth': '100%',
  },
  'moduleName': {
    'fontFamily': settings.headerSanSerif,
    'fontWeight': '700',
    'lineHeight': '24px',
    'color': theme.fgMain,
    'whiteSpace': 'nowrap',
    'overflow': 'hidden',
    'textOverflow': 'ellipsis',
  },
  'accountContainer': {
    'display': 'flex',
    'columnGap': '0.3em',
    'alignItems': 'center',
  },
  'accountLink': {
    'overflow': 'hidden',
    'marginTop': '0.3em',
  },
  'accountName': {
    'fontFamily': settings.bodySanSerif,
    'fontWeight': '600',
    'fontSize': '12px',
    'color': theme.fgMuted,
    'margin': '0',
    'lineHeight': '16px',
    'whiteSpace': 'nowrap',
    'overflow': 'hidden',
    'textOverflow': 'ellipsis',
  },
  'moduleIcons': {
    'marginLeft': 'auto',
    'paddingLeft': '1.1em',
    'display': 'flex',
    'columnGap': '0.7em',
    'alignItems': 'center',
  },
  'clone': {
    'backgroundColor': theme.cloneIconBg,
    'height': '18px',
    'borderRadius': '2px',
  },
  'moduleTryout': {
    'height': '18px',
  },
}))

interface IModuleCard {
  account?: IAccount | IPublicAccount
  module: IBrowseModule
  pageName: string  // For a8
  showAgency?: boolean
}

const ModuleCard: React.FC<IModuleCard> = ({account, module, pageName, showAgency = false}) => {
  const classes = useStyles()

  const moduleAccount = account  // || module.Account
  const isAccount = moduleAccount ? moduleAccount.icon : null
  const moduleAccountIconSet = isAccount && responsiveAccountIcons(moduleAccount)

  const showCheckBadge = moduleAccount &&
    (isPartner(moduleAccount) || is8thWallAccountUuid(moduleAccount.uuid))

  const moduleIcons = (
    <div className={classes.moduleIcons}>
      {module.repoVisibility === 'PUBLIC' && module.publicFeatured &&
        <img
          className={classes.clone}
          src={icons.projectClone}
          alt='Clone'
          title='Code Available'
        />
      }
    </div>
  )

  return (
    <div className={classes.moduleCard}>
      <div className={classes.card}>
        <Link
          to={getPublicPathForModule(moduleAccount, module)}
          a8={`click;${pageName};click-module-card-${module.name}`}
        >
          <img
            className={classes.coverImage}
            draggable={false}
            src={deriveModuleCoverImageUrl(module, COVER_IMAGE_PREVIEW_SIZES[600])}
            alt={getDisplayNameForModule(module)}
          />
        </Link>
      </div>
      <div className={classes.moduleInfo}>
        {showAgency &&
          <Link
            className={classes.accountLogoContainer}
            to={getPublicPathForAccount(moduleAccount)}
          >
            <ResponsiveImage
              className={classes.accountLogo}
              width={40}
              alt={`${moduleAccount.name} Logo`}
              sizeSet={moduleAccountIconSet}
            />
          </Link>
        }
        <div className={classes.moduleText}>
          <Link
            to={getPublicPathForModule(moduleAccount, module)}
            a8={`click;${pageName};click-module-card-${module.name}`}
          >
            <p
              className={classes.moduleName}
              title={getDisplayNameForModule(module)}
            >
              {getDisplayNameForModule(module)}
            </p>
          </Link>
          {showAgency &&
            <div className={classes.accountContainer}>
              <Link
                className={classes.accountLink}
                to={moduleAccount ? getPublicPathForAccount(moduleAccount) : ''}
              >
                <p
                  className={classes.accountName}
                  title={moduleAccount.name}
                >
                  {moduleAccount.name}
                </p>
              </Link>
              {showCheckBadge && <CheckedCertificateIcon height={1} />}
              {moduleIcons}
            </div>
          }
        </div>
        {!showAgency && moduleIcons}
      </div>
    </div>
  )
}

export default ModuleCard
