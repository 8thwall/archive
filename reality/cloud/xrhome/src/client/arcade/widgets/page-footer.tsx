import * as React from 'react'
import {createUseStyles} from 'react-jss'

import LinkOut from '../../uiWidgets/link-out'
import {Icon} from './icon'
import {
  white, brandGray2, brandGray3, centeredSectionMaxWidth, mobileViewOverride,

} from '../../static/arcade/arcade-settings'
import {hexColorWithAlpha} from '../../../shared/colors'
import {BrandLogo} from './brand-logo'

const useStyles = createUseStyles({
  footerContainer: {
    margin: '4rem auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: `calc(${centeredSectionMaxWidth} + 6rem)`,
    maxWidth: 'calc(100% - 5rem)',
    [mobileViewOverride]: {
      width: 'unset',
      maxWidth: '100%',
      flexDirection: 'column',
      margin: '2.5rem 1.5rem',
      scrollSnapAlign: 'end',
      /*
        The following is a workaround to not overlap the footer with the bottom of the mobile screen
        where the mobile browser's address bar/tool bar is located. The margin bottom needs to be
        larger than scrollMarginBottom to avoid a scroll snapping shift when scrolling back from the
        bottom of the page.
        */
      scrollMarginBottom: '7.5rem',
      marginBottom: '10rem',

    },
  },
  brandContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandLinks: {
    'display': 'flex',
    'flexDirection': 'row',
    'gap': '1rem',
    '& a': {
      'color': brandGray3,
      'textDecoration': 'none',
      'fontSize': '0.75rem',
      'lineHeight': '1rem',
      'padding': '0.625rem 0',
      '&:hover': {
        color: white,
      },
    },
  },
  socialLinks: {
    'paddingTop': '1.375rem',
    'display': 'flex',
    'gap': '0.5rem',
    '& > a': {
      'width': '2.5rem',
      'height': '2.5rem',
      'textDecoration': 'none',
      'borderRadius': '50%',
      'background': hexColorWithAlpha(white, 0.05),
      'boxShadow':
        `0px 1px 1px 0px ${hexColorWithAlpha(white, 0.30)} inset, ` +
        `0px 0px 0px 1px ${hexColorWithAlpha(white, 0.05)} inset`,
      'position': 'relative',
      'boxSizing': 'border-box',
      'display': 'flex',
      'justifyContent': 'center',
      'alignItems': 'center',
      '& > svg': {
        'stroke': brandGray2,
      },
      '&:hover': {
        'background': hexColorWithAlpha(white, 0.10),
        '& > svg': {
          stroke: white,
        },
      },
    },
    [mobileViewOverride]: {
      'paddingTop': '0.875rem',
    },
  },
})

const PageFooter = () => {
  const classes = useStyles()

  return (
    <footer className={classes.footerContainer}>
      <div className={classes.brandContainer}>
        <BrandLogo />
        <div className={classes.brandLinks}>
          <LinkOut url='https://www.8thwall.com/products/niantic-studio'>Niantic Studio</LinkOut>
          <LinkOut url='https://www.8thwall.com/terms'>Term of Service</LinkOut>
          <LinkOut url='https://www.8thwall.com/privacy'>Privacy Policy</LinkOut>
        </div>
      </div>
      <div className={classes.socialLinks}>
        <LinkOut url='https://www.youtube.com/8thwall' aria-label='YouTube'>
          <Icon name='socialYouTube' height={18} width={19} />
        </LinkOut>
        <LinkOut url='https://www.linkedin.com/company/8thwall' aria-label='LinkedIn'>
          <Icon name='socialLinkedIn' height={18} width={18} />
        </LinkOut>
        <LinkOut url='https://www.discord.com/invite/RM6m4nWmYp' aria-label='Discord'>
          <Icon name='socialDiscord' height={18} width={20} />
        </LinkOut>
        <LinkOut url='https://www.tiktok.com/@8thwall.ar' aria-label='TikTok'>
          <Icon name='socialTikTok' height={18} width={18} />
        </LinkOut>
      </div>
    </footer>
  )
}

export default React.memo(PageFooter)
