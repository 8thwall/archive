import * as React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import FTUERetrievableImage from '../../static/ftue_retrievable_graphic.png'
import {
  bodySanSerif, brandHighlight, csBlack, lightBlue, tinyViewOverride,
} from '../../static/styles/settings'
import {hexColorWithAlpha} from '../../../shared/colors'

const useStyles = createUseStyles({
  openModalButton: {
    'padding': '2em',
    'position': 'relative',
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'flexDirection': 'column',
    'color': 'white',
    'width': '100%',
    'height': '100%',
    'border': 'none',
    'borderRadius': '16px',
    'background': `linear-gradient(0deg, ${hexColorWithAlpha(csBlack, 0.75)},
      ${hexColorWithAlpha(csBlack, 0.75)}),
      linear-gradient(to right, ${csBlack} 2.06%, ${lightBlue} 64.36%, ${brandHighlight} 119.6%)`,
    'cursor': 'pointer',
    'overflow': 'hidden',
    'transition': 'background-position 0.5s',
    '&:hover': {
      background: `linear-gradient(0deg, ${hexColorWithAlpha(csBlack, 0.75)},
      ${hexColorWithAlpha(csBlack, 0.75)}),
      linear-gradient(to left, ${csBlack} 2.06%, ${lightBlue} 64.36%, ${brandHighlight} 119.6%)`,
    },
    '&:hover $imageContainer': {
      filter: 'blur(2px)',
      opacity: 0.5,
    },
    [tinyViewOverride]: {
      gap: '0.5em',
    },
  },
  imageContainer: {
    'position': 'absolute',
    'bottom': 0,
    'left': '1%',
    'width': '600px',
    'height': '100%',
    'background': `url(${FTUERetrievableImage})`,
    'backgroundSize': '500px',
    'backgroundPosition': 'center left',
    'backgroundRepeat': 'no-repeat',
    'maskImage': 'linear-gradient(to left, rgba(0,0,0,0) 40%, rgba(0,0,0,1) 90%)',
    'transform': 'scale(1.05)',
    [tinyViewOverride]: {
      display: 'none',
    },
  },
  heading: {
    'color': 'var(--White, #FFF)',
    'textAlign': 'center',
    'text-align': 'center',
    'font-family': bodySanSerif,
    'font-size': '18px',
    'font-style': 'normal',
    'font-weight': '700',
    'line-height': '24px',
    'margin': '0',
    'zIndex': 2,
  },
  subheading: {
    'color': 'var(--White, #FFF)',
    'textAlign': 'center',
    'fontFamily': bodySanSerif,
    'fontSize': '14px',
    'fontStyle': 'normal',
    'fontWeight': '600',
    'lineHeight': '24px',
    'margin': '0',
    'zIndex': 2,
  },

})

interface IFirstTimeUserRetrievable {
  open: (isOpen: boolean) => void
}

const FirstTimeUserRetrievable: React.FC<IFirstTimeUserRetrievable> = ({
  open,
}) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()

  return (
    <button
      onClick={() => open(true)}
      type='button'
      className={classes.openModalButton}
    >
      <h3 className={classes.heading}>
        {t('account_dashboard_page.first_time_user_modal.button.banner.heading')}
      </h3>
      <h3 className={classes.subheading}>
        {t('account_dashboard_page.first_time_user_modal.button.banner.subheading')}
      </h3>
      <div className={classes.imageContainer} />
    </button>
  )
}

export {FirstTimeUserRetrievable}
