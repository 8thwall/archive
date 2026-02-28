import React from 'react'
import {useTranslation, Trans} from 'react-i18next'

import type {UiTheme} from '../../ui/theme'
import {createCustomUseStyles} from '../../common/create-custom-use-styles'
import {MILLISECONDS_PER_SECOND} from '../../../shared/time-utils'

const MODAL_TIMEOUT_SECONDS = 3

// eslint-disable-next-line local-rules/hardcoded-copy, max-len
const CHECKMARK_SVG = 'M58 29C58 45.018 45.018 58 29 58C12.982 58 0 45.018 0 29C0 12.982 12.982 0 29 0C45.018 0 58 12.982 58 29ZM27.6186 38.4936C26.3838 39.7283 24.3674 39.7283 23.1326 38.4936L15.8826 31.2436C14.6479 30.0088 14.6479 27.9924 15.8826 26.7576C17.1174 25.5229 19.1338 25.5229 20.3686 26.7576L25.3756 31.7647L37.6326 19.5076C38.8674 18.2729 40.8838 18.2729 42.1186 19.5076C43.3533 20.7424 43.3533 22.7588 42.1186 23.9936L27.6186 38.4936ZM5.4375 29C5.4375 15.984 15.984 5.4375 29 5.4375C42.016 5.4375 52.5625 15.984 52.5625 29C52.5625 42.016 42.016 52.5625 29 52.5625C15.984 52.5625 5.4375 42.016 5.4375 29Z'

const useStyles = createCustomUseStyles<{timerPercent: number}>()((theme: UiTheme) => ({
  'container': {
    textAlign: 'center',
    padding: '2em 3em',
    backgroundColor: theme.modalContentBg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1em',
  },
  'icon': {
    fill: theme.fgSuccess,
  },
  'heading': {
    margin: 0,
  },
  'bodyText': {
    margin: 0,
  },
  '@keyframes progressAnimation': {
    from: {width: '100%'},
    to: {width: '0'},
  },
  'countdownMeter': {
    backgroundColor: theme.fgSuccess,
    height: '0.75em',
    animation: `$progressAnimation ${MODAL_TIMEOUT_SECONDS}s`,
    animationTimingFunction: 'linear',
    animationIterationCount: 1,
    animationFillMode: 'forwards',
  },
}))

interface ICompleteSupportView {
  handleModalClose: () => void
  email: string
}

const CompleteSupportView: React.FC<ICompleteSupportView> = ({
  handleModalClose, email,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['app-pages'])

  React.useEffect(() => {
    setTimeout(() => {
      handleModalClose()
    }, MODAL_TIMEOUT_SECONDS * MILLISECONDS_PER_SECOND)
  }, [])

  const icon = (
    // eslint-disable-next-line local-rules/hardcoded-copy
    <svg width='58' height='58' viewBox='0 0 58 58' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        className={classes.icon}
        fillRule='evenodd'
        clipRule='evenodd'
        d={CHECKMARK_SVG}
      />
    </svg>
  )

  return (
    <div>
      <div className={classes.container}>
        {icon}
        <h1 className={classes.heading}>
          {t('in_app_help_center.complete_support_view.heading')}
        </h1>
        <p className={classes.bodyText}>
          <Trans
            ns='app-pages'
            i18nKey='in_app_help_center.complete_support_view.body'
            values={{email}}
            components={{1: <strong />}}
          />
        </p>
      </div>
      <div
        className={classes.countdownMeter}
      />
    </div>
  )
}

export {CompleteSupportView}
