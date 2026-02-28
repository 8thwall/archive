import React from 'react'
import {Link} from 'react-router-dom'

import LinkOut from '../uiWidgets/link-out'
import {tinyViewOverride} from '../static/styles/settings'
import ResponsiveImage from '../common/responsive-image'
import {getPublicPathForAccount} from '../common/paths'
import type {IPartnerAccount} from './partners-types'
import {fixAccountUrl} from '../../shared/account-utils'
import PremierLabel from './premier-label'
import {Icon} from '../ui/components/icon'
import {createThemedStyles} from '../ui/theme'
import {StandardContainer} from '../ui/components/standard-container'

const titleLineHeight = 1.5
const tinyTitleLineHeight = 1.25
const titleMaxLines = 2

const useStyles = createThemedStyles(theme => ({
  partnerCard: {
    'transition': [['all', '0.1s', 'linear']],
    'textDecoration': 'none',
    '&:hover': {
      transform: 'scale(1.05)',
    },
    'width': '100%',
    'borderRadius': '10px',
  },
  card: {
    'display': 'flex',
    'width': '100%',
    'minHeight': '0',
    'height': '96px',
    'border': '0',
    'borderRadius': '10px',
    'alignItems': 'center',
    'textAlign': 'center !important',
  },
  logo: {
    'height': '64px',
    'width': '64px',
    'margin': '0 12px 0 16px',
    [tinyViewOverride]: {
      minHeight: '75px',
      minWidth: '75px',
    },
    '& img': {
      objectFit: 'cover',
      height: '100%',
      width: '100%',
      borderRadius: '50%',
    },
  },
  partnerInfo: {
    'display': 'flex',
    [tinyViewOverride]: {
      'width': '65%',
    },
    'flex-direction': 'column',
  },
  titleContainer: {
    'margin': '4px 12px 0',
    'height': 'auto',
    'display': 'flex',
    'whiteSpace': 'nowrap',
    'minHeight': `calc(${titleLineHeight} * ${titleMaxLines})`,
    'maxWidth': '196px',
    [tinyViewOverride]: {
      minHeight: `calc(${tinyTitleLineHeight} * ${titleMaxLines})`,
      width: '-webkit-fill-available',
    },
    '& > h4': {
      'fontFamily': theme.headingFontFamily,
      'fontWeight': '700',
      'fontSize': '16px',
      'color': theme.fgMain,
      'lineHeight': titleLineHeight,
      'maxHeight': `calc(${titleLineHeight} * ${titleMaxLines})`,
      'overflow': 'hidden',
      'textOverflow': 'ellipsis',
      [tinyViewOverride]: {
        lineHeight: tinyTitleLineHeight,
        maxHeight: `calc(${tinyTitleLineHeight} * ${titleMaxLines})`,
      },
    },
  },
  locationContainer: {
    'margin': '0 12px',
    'height': 'auto',
    'display': 'flex',
    'whiteSpace': 'nowrap',
    'minHeight': `calc(${titleLineHeight} * ${titleMaxLines})`,
    'maxWidth': '196px',
    'gap': '0.25rem',
    [tinyViewOverride]: {
      minHeight: `calc(${tinyTitleLineHeight} * ${titleMaxLines})`,
      width: '-webkit-fill-available',
    },
    '& > svg': {
      'minWidth': '12px',
      'minHeight': '16px',
      'width': '12px',
    },
    '& > p': {
      'color': theme.fgMain,
      'overflow': 'hidden',
      'textOverflow': 'ellipsis',
    },
  },
  premierLabel: {
    'display': 'flex',
    'margin': '8px 12px',
  },
}))

interface IPartnerCard {
  partner: IPartnerAccount & {address: {city: string, state: string, country: string}}
  a8: string
}

const PartnerCard: React.FunctionComponent<IPartnerCard> = ({
  partner,
  a8,
}) => {
  const styles = useStyles()
  const {city, state, country} = partner.address
  const address = [city, state, country].filter(Boolean).join(', ')

  const contents = (
    <StandardContainer padding='none'>
      <div className={styles.card} id='partner-card'>
        <div className={styles.logo}>
          <ResponsiveImage
            width={100}
            alt={`${partner.name} logo`}
            sizeSet={partner.icon}
          />
        </div>
        <div className={styles.partnerInfo}>
          <div className={styles.titleContainer}>
            <h4>{partner.name}</h4>
          </div>
          {address &&
            <div className={styles.locationContainer}>
              <Icon stroke='location' color='main' />
              <p>{address}</p>
            </div>
        }
          <div className={styles.premierLabel}>
            {partner.verifiedPremierePartner && <PremierLabel />}
          </div>
        </div>
      </div>
    </StandardContainer>
  )

  // Just to note here that publicFeatured can be forced to false by the server side
  // If the partner is no loger a paid account
  if (partner.publicFeatured) {
    return (
      <Link
        className={styles.partnerCard}
        a8={a8}
        to={getPublicPathForAccount(partner.shortName)}
      >
        {contents}
      </Link>
    )
  } else {
    return (
      <LinkOut
        className={styles.partnerCard}
        a8={a8}
        url={fixAccountUrl(partner.url)}
      >
        {contents}
      </LinkOut>
    )
  }
}

export default PartnerCard
