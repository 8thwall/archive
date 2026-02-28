import * as React from 'react'

import {useTranslation} from 'react-i18next'

import actions from './partners-actions'
import useActions from '../common/use-actions'
import {combine} from '../common/styles'
import Page from '../widgets/page'
import ErrorMessage from '../home/error-message'
import PartnerCard from './partner-card'
import {FadeIn} from '../widgets/fade-in'
import {
  brandWhite,
  brandPurple,
  mobileViewOverride,
  tinyViewOverride,
} from '../static/styles/settings'
import verified from '../static/verifiedBadge.svg'
import icons from '../apps/icons'
import {useSelector} from '../hooks'
import {Loader} from '../ui/components/loader'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  page: {
    '& > .page-content': {
      padding: '0 !important',
    },
  },
  errorMessage: {
    width: '100%',
    margin: 'auto',
  },
  loaderContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: '64px 32px',
    [tinyViewOverride]: {
      padding: '32px 24px',
    },
  },
  verifiedBadge: {
    maxHeight: '32px',
    margin: 'auto 8px',
    [tinyViewOverride]: {
      maxHeight: '24px',
      margin: 'auto 6px',
    },
  },
  partnerHeading: {
    fontFamily: `${theme.headingFontFamily} !important`,
    fontWeight: 900,
    fontSize: '32px',
    lineHeight: 1.5,
    display: 'flex',
    justifyContent: 'center',
    AlignItems: 'center',
    flexWrap: 'nowrap',
    marginBottom: '16px',
    [tinyViewOverride]: {
      fontSize: '20px',
      lineHeight: '30px',
    },
  },
  partnerDescription: {
    'fontFamily': `${theme.subHeadingFontFamily} !important`,
    'fontWeight': '500',
    'fontSize': '20px',
    'lineHeight': 1.5,
    'maxWidth': '980px',
    'margin': 'auto',
    'marginBottom': '16px',
    'textAlign': 'center',
    [tinyViewOverride]: {
      maxWidth: '24em',
      fontSize: '18px',
      lineHeight: '27px',
    },
  },
  partnerList: {
    'padding': '32px 0',
    'display': 'grid',
    'rowGap': '16px',
    'columnGap': '16px',
    'gridTemplateColumns': 'repeat(auto-fill, 316px)',
    [tinyViewOverride]: {
      'gridTemplateColumns': 'repeat(auto-fill, minmax(258px, 316px))',
    },
    'justifyContent': 'center',
    'margin': '0 1rem 0 1rem',
  },
  partnerBecomeSection: {
    justifyContent: 'center',
    display: 'flex',
    textAlign: 'center',
    background: brandPurple,
  },
  partnerBecomeContainer: {
    'display': 'flex',
    'flexDirection': 'column',
    'justifyContent': 'center',
    'alignItems': 'center',
    'color': brandWhite,
    'marginBottom': '16px',
    'maxWidth': '937px',
    'textAlign': 'left',
    [tinyViewOverride]: {
      'textAlign': 'center',
    },
    '& h2': {
      display: 'inline-block',
      fontFamily: `${theme.headingFontFamily} !important`,
      fontSize: '24px',
      [tinyViewOverride]: {
        fontSize: '20px',
      },
      fontWeight: 900,
      marginTop: 0,
    },
    '& p': {
      fontFamily: `${theme.bodyFontFamily} !important`,
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: '27px',
      textAlign: 'center',
      marginBottom: '32px',
      [mobileViewOverride]: {
        marginBottom: '24px',
      },
      [tinyViewOverride]: {
        textAlign: 'left',
        marginBottom: '16px',
      },
    },
  },
}))

const PartnersPage: React.FunctionComponent = () => {
  const {t, i18n} = useTranslation(['public-featured-pages'])
  // TODO(wayne): reconsider combining these two kinds of partners
  // on the server side for future refresh
  const {premierPartners, partners} = useSelector(state => state.partners)
  const allPartners = premierPartners.concat(partners)
  const {getPartners} = useActions(actions)
  const [isLoading, setIsLoading] = React.useState(true)
  const styles = useStyles()

  React.useEffect(() => {
    getPartners().then(() => setIsLoading(false))
  }, [i18n.language])

  return (
    <Page
      className={styles.page}
      centered={false}
      title='Partners - Verified WebAR Experts'
      commonPrefixed
    >
      <ErrorMessage className={styles.errorMessage} />
      <section className={styles.section}>
        <FadeIn>
          <>
            <h2 className={styles.partnerHeading}>
              {t('partners_page.heading.connect_with_partner')}
              <img src={verified} className={styles.verifiedBadge} alt='Verified Badge' />
            </h2>

            <p className={styles.partnerDescription}>
              {t('partners_page.description.connect_with_partner')}
            </p>

            {isLoading
              ? (
                <div className={styles.loaderContainer}>
                  <Loader inline centered />
                </div>
              )
              : (
                <div className={styles.partnerList}>
                  {allPartners.sort((a, b) => {
                    // TODO(kim): This is a one time thing for Gravity Jack. Delete later.
                    if (a.shortName === 'gravityjack') return -1
                    if (b.shortName === 'gravityjack') return 1
                    return 0
                  }).map(partner => (
                    <PartnerCard
                      partner={partner}
                      key={partner.shortName}
                      a8={`click;partners-page;partner-card-${partner.shortName}`}
                    />
                  ))}
                </div>
              )
            }
          </>
        </FadeIn>
      </section>
      <section className={combine(styles.section, styles.partnerBecomeSection)}>
        <FadeIn>
          <div className={styles.partnerBecomeContainer}>
            <img
              src={icons.partnersBadge}
              alt='Partner Badge'
              title='Partner Hexagon'
            />
            <h2>
              {t('partners_page.heading.about_partners')}
            </h2>
            <p>
              {t('partners_page.description.about_partners')}
            </p>
          </div>
        </FadeIn>
      </section>
    </Page>
  )
}

export default PartnersPage
