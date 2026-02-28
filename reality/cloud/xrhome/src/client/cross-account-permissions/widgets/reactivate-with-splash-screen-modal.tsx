import React from 'react'
import {Modal, Dimmer} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'

import type {IApp} from '../../common/types/models'
import useActions from '../../common/use-actions'
import appsBillingActions from '../../billing/apps-billing-actions'
import {Loader} from '../../ui/components/loader'
import {TertiaryButton} from '../../ui/components/tertiary-button'
import {LinkButton} from '../../ui/components/link-button'
import icons from '../../apps/icons'
import {useGitDeployments} from '../../git/hooks/use-deployment'
import {actions as gitActions} from '../../git/git-actions'

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    margin: '1.71em',
    gap: '1em',
  },
  header: {
    fontSize: '1.71em',
    fontWeight: 700,
    lineHeight: '1.57em',
    wordWrap: 'break-word',
  },
  blurb: {
    lineHeight: '1.71em',
  },
  modalContainer: {
    padding: '3em',
    display: 'flex',
    flexDirection: 'column',
    gap: '2em',
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  buttonRow: {
    display: 'flex',
    gap: '1em',
    justifyContent: 'center',
  },
  warningIcon: {
    height: '3em',
  },
})

interface IRemoveProjectConfirmationModal {
  onClose: () => void
  app: IApp
}

const ReactivateWithSplashScreenModal: React.FC<IRemoveProjectConfirmationModal> = (
  {onClose, app}
) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const classes = useStyles()
  const dispatch = useDispatch()
  const [isLoading, setLoading] = React.useState(false)

  const deployment = useGitDeployments(app.repoId)
  const {redeployBranches} = useActions(gitActions)
  const {reactivateWithSplashScreen} = useActions(appsBillingActions)

  const onConfirmReactivate = async () => {
    setLoading(true)
    await dispatch?.(reactivateWithSplashScreen(app.uuid))

    // Republish the app with the default splash screen
    if (deployment && (deployment.master || deployment.staging || deployment.production)) {
      await dispatch(redeployBranches(app.uuid))
    }
    setLoading(false)
  }

  return (
    <Modal
      open
      onClose={isLoading ? undefined : onClose}
      closeOnDimmerClick={!isLoading}
      size='small'
      className={classes.container}
    >
      <div className={classes.modalContainer}>
        <div className={classes.modalContent}>
          {/* eslint-disable local-rules/hardcoded-copy */}
          <img
            className={classes.warningIcon}
            src={icons.warningBlack}
            draggable={false}
            alt='warning'
          />
          {/* eslint-enable local-rules/hardcoded-copy */}
          <h2>{t('project_settings_page.reactivate_with_splash_screen_modal.header')}</h2>
          <p>
            {t('project_settings_page.reactivate_with_splash_screen_modal.description')}
          </p>
        </div>
        <div className={classes.buttonRow}>
          <LinkButton
            onClick={onClose}
          >
            {t('button.cancel', {ns: 'common'})}
          </LinkButton>
          <TertiaryButton
            spacing='wide'
            onClick={onConfirmReactivate}
          >
            {t('project_settings_page.reactivate_with_splash_screen_modal.button.reactivate')}
          </TertiaryButton>
        </div>
      </div>
      <Dimmer active={isLoading} inverted>
        <Loader />
      </Dimmer>
    </Modal>
  )
}

export {ReactivateWithSplashScreenModal}
