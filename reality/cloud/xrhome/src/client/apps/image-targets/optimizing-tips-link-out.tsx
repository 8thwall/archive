import * as React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import linkOutIcon from '../../static/openLink.svg'

const useStyles = createUseStyles({
  inlineIcon: {
    position: 'relative',
    top: '0.25em',
  },
})

export default () => {
  const {t} = useTranslation(['app-pages'])
  const classes = useStyles()
  return (
    <a
      target='_blank'
      rel='noopener noreferrer'
      href='https://www.8thwall.com/docs/web/#optimizing-image-target-tracking'
    >
      {t('image_target_page.optimizing_tips_link_out')}&nbsp;
      <img
        className={classes.inlineIcon}
        alt={t('link.open_new_window', {ns: 'common'})}
        src={linkOutIcon}
      />
    </a>
  )
}
