import * as React from 'react'

import LinkOut from '../uiWidgets/link-out'
import {
  brandPop, brandPurple, brandWhite, moonlight,
} from '../static/styles/settings'
import newsletterGraphic from '../static/icons/newsletter_graphic.svg'
import {createThemedStyles} from '../ui/theme'

// eslint-disable-next-line max-len
const MAIL_LINK = 'https://8thwall.us16.list-manage.com/subscribe?u=147d989b3e58f994bd9bfafdf&id=896ac3c43f'

const useStyles = createThemedStyles(theme => ({
  title: {
    fontWeight: '900',
    fontSize: '1.5em',
    fontFamily: `${theme.headingFontFamily} !important`,
  },
  subtitle: {
    fontWeight: '500',
    fontFamily: `${theme.subHeadingFontFamily} !important`,
  },
  link: {
    backgroundColor: moonlight,
    borderRadius: '42px',
    width: '100%',
    padding: '0.5em',
    textAlign: 'center',
    color: brandPurple,
    fontFamily: theme.bodyFontFamily,
    fontWeight: '700',
    margin: '2em 0 1em 0',
  },
  wrapper: {
    background: `linear-gradient(${brandPurple}, ${brandPop})`,
    minHeight: '25em',
    color: brandWhite,
    fontFamily: `${theme.headingFontFamily} !important`,
    padding: '4em 2em 0 2em',
  },
  img: {
    width: '200px',
    height: '169px',
  },
  imgWrapper: {
    width: '100%',
    textAlign: 'center',
  },
}))

const CtaCard = () => {
  const styles = useStyles()
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>
        Subscribe to the 8th Wall newsletter
      </p>
      <p className={styles.subtitle}>
        Stay up-to-date on new feature releases, WebAR trends and more.
      </p>
      {/* TODO (tri): get mailchimp link from Jen */}
      <LinkOut url={MAIL_LINK} a8='click;blog;click-cta-get-started'>
        <div className={styles.link}>
          Sign up
        </div>
      </LinkOut>
      <div className={styles.imgWrapper}>
        <img className={styles.img} src={newsletterGraphic} alt='newsletter icon' />
      </div>
    </div>
  )
}

export default CtaCard
