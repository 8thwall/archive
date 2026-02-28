import * as React from 'react'
import {Link, Redirect, useLocation} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import Page from '../widgets/page'
import {Footer} from '../widgets/web8-footer'
import {isPrivatePath} from '../common/paths'
import IndustryCarousel from '../discovery/industry-carousel'
import {KEYWORDS} from '../../shared/discovery-constants'
import usePageStyles from '../styles/page-styles'
import {mobileViewOverride} from '../static/styles/settings'
import {combine} from '../common/styles'
import {PrimaryButton} from '../ui/components/primary-button'
import {createThemedStyles} from '../ui/theme'
import {useUserHasSession} from '../user/use-current-user'

const useStyles = createThemedStyles(theme => ({
  page: {
    backgroundColor: theme.bgMain,
    color: theme.fgMain,
  },
  buttonContainer: {
    paddingTop: '2rem',
    textAlign: 'center',
  },
  mainContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10em',
    [mobileViewOverride]: {
      gap: 0,
      flexDirection: 'column-reverse',
      marginBottom: '1em',
      padding: 0,
      paddingTop: '5em',
    },
  },
  textContainer: {
    maxWidth: '30em',
    [mobileViewOverride]: {
      maxWidth: '45em',
      textAlign: 'center',
    },
  },
  headingText: {
    fontWeight: 900,
    fontFamily: theme.headingFontFamily,
    fontSize: '2.25em',
    lineHeight: '1.25em',
    marginBottom: '0.5em',
    [mobileViewOverride]: {
      fontSize: '2.5em',
    },
  },
  bodyText: {
    lineHeight: '1.25em',
    fontSize: '1.25em',
    [mobileViewOverride]: {
      fontSize: '1.5em',
    },
  },
}))

const NotFoundPage: React.FC = () => {
  const {t} = useTranslation(['not-found-page'])
  const location = useLocation()
  const classes = useStyles()
  const pageStyles = usePageStyles()
  const isLoggedIn = useUserHasSession()

  if (!isLoggedIn && isPrivatePath(location.pathname)) {
    return <Redirect to={`/login?redirectTo=${encodeURIComponent(location.pathname)}`} />
  }

  return (
    <Page
      className={classes.page}
      customFooter={<Footer />}
      centered={false}
      fromNotFoundPage
    >
      <div className={combine(classes.mainContainer, pageStyles.sectionProfile)}>
        <div className={classes.textContainer}>
          <div className={classes.headingText}>
            {t('not_found_page.heading')}
          </div>
          <div className={classes.bodyText}>
            {t('not_found_page.description')}
          </div>
        </div>
      </div>
      <IndustryCarousel keywords={KEYWORDS} pageName='404' />
      <div className={classes.buttonContainer}>
        <Link
          to='/discover'
          a8='click;error-404;click-industry-carousel-explore-all'
        >
          <PrimaryButton>
            {t('not_found_page.button.explore_more')}
          </PrimaryButton>
        </Link>
      </div>
    </Page>
  )
}

export default NotFoundPage
