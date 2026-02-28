import React from 'react'
import {Dimmer, Modal} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {UiThemeProvider} from '../../ui/theme'
import {
  brandWhite, csBlack, gray3, mobileViewOverride, tinyViewOverride,
} from '../../static/styles/settings'
import {FirstTimeAppsView} from './first-time-user-apps-view'
import {LinkButton} from '../../ui/components/link-button'
import leftGraphic from '../../static/ftue_left_graphic.png'
import topGraphic from '../../static/ftue_top_graphic.png'
import {Loader} from '../../ui/components/loader'

const useStyles = createUseStyles({
  modal: {
    position: 'relative',
    overflow: 'hidden',
    background: `${csBlack} !important`,
    width: '60em !important',
    [mobileViewOverride]: {
      width: '95% !important',
      margin: '1em',
    },
  },
  modalContainer: {
    padding: '3em 0',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    gap: '0.5em',
    marginTop: '2em',
    padding: '0 3em',
    alignItems: 'center',
    [tinyViewOverride]: {
      marginTop: 0,
    },
  },
  modalHeading: {
    color: brandWhite,
    fontSize: '1.5em',
  },
  modalSubHeading: {
    color: gray3,
    fontSize: '1.125em',
    maxWidth: '42em',
  },
  modalFooter: {
    padding: '0 3em',
    display: 'flex',
    justifyContent: 'center',
  },
  topGraphic: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: -1,
    [tinyViewOverride]: {
      display: 'none',
    },
  },
  leftGraphic: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: -2,
  },
})

interface IFirstTimeUserModal {
  open: boolean
  onClose: () => void
  closable: boolean
}

const FirstTimeUserModal: React.FC<IFirstTimeUserModal> = ({
  open, onClose, closable,
}) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const [loading, setLoading] = React.useState(false)

  return (
    <UiThemeProvider mode='dark'>
      <Modal
        open={open}
        onClose={closable ? onClose : undefined}
        closeOnDimmerClick={false}
        size='tiny'
        className={classes.modal}
      >
        <div className={classes.modalContainer}>
          <div className={classes.modalHeader}>
            <div className={classes.modalHeading}>
              {t('account_dashboard_page.first_time_user_modal.heading')}
            </div>
            <div className={classes.modalSubHeading}>
              {t('account_dashboard_page.first_time_user_modal.subheading')}
            </div>
          </div>
          <FirstTimeAppsView
            onAppDuplicateStart={() => setLoading(true)}
            onAppDuplicateComplete={() => setLoading(false)}
          />
          <div className={classes.modalFooter}>
            <LinkButton
              onClick={onClose}
            >
              {t('account_dashboard_page.first_time_user_modal.button.skip')}
            </LinkButton>
          </div>
        </div>
        <img className={classes.topGraphic} draggable={false} src={topGraphic} alt='' />
        <img className={classes.leftGraphic} draggable={false} src={leftGraphic} alt='' />
        <Dimmer active={loading}>
          <Loader>
            {t('account_dashboard_page.first_time_user_modal.loading_while_duplicating')}
          </Loader>
        </Dimmer>
      </Modal>
    </UiThemeProvider>
  )
}

export {
  FirstTimeUserModal,
}
