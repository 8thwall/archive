import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {blueberry, darkBlueberry} from '../static/styles/settings'
import {hexColorWithAlpha} from '../../shared/colors'
import {MILLISECONDS_PER_DAY} from '../../shared/time-utils'

const useStyles = createUseStyles({
  banner: {
    width: '100%',
    textAlign: 'center',
    background: hexColorWithAlpha(blueberry, 0.10),
    color: darkBlueberry,
    fontSize: '1.16em',
    fontWeight: 'bold',
    lineHeight: '2em',
    margin: '0.8em 0',
  },
})

interface IValidTimeBannerProps {
  validTimeMillis: number
}

const ValidTimeBanner: React.FC<IValidTimeBannerProps> = ({validTimeMillis}) => {
  const {t} = useTranslation(['checkout'])
  const classes = useStyles()
  const numDays = validTimeMillis / MILLISECONDS_PER_DAY

  return (
    <div className={classes.banner}>{t('accessTimeBanner', {count: numDays})}</div>
  )
}

export default ValidTimeBanner
