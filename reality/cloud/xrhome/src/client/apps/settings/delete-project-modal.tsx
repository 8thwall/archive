import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {useRouteMatch} from 'react-router-dom'

import {StandardModal} from '../../ui/components/standard-modal'
import {UiThemeProvider} from '../../ui/theme'
import {useSelector} from '../../hooks'
import {getRouteApp} from '../../common/paths'
import {LinkButton} from '../../ui/components/link-button'
import {TertiaryButton} from '../../ui/components/tertiary-button'
import {StandardTextField} from '../../ui/components/standard-text-field'
import icons from '../icons'

const useStyles = createUseStyles({
  modalContainer: {
    padding: '3em',
    maxWidth: '40em',
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

interface IDeleteProjectModal {
  trigger: React.ReactElement
  onDelete: () => Promise<void>
}

const DeleteProjectModal: React.FC<IDeleteProjectModal> = ({
  trigger, onDelete,
}) => {
  const classes = useStyles()
  const match = useRouteMatch()
  const app = useSelector(state => getRouteApp(state, match))
  const {t} = useTranslation(['app-pages', 'common'])
  const [fieldInput, setFieldInput] = React.useState('')

  return (
    <UiThemeProvider mode='light'>
      <StandardModal
        trigger={trigger}
      >
        {collapse => (
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
              <h2>{t('project_settings_page.delete_project_modal.heading')}</h2>
              <p>
                {t('project_settings_page.delete_project_modal.description',
                  {appName: app.appName})}
              </p>
              <p>{t('project_settings_page.delete_project_modal.type_delete')}</p>
              <StandardTextField
                id='confirm-delete-project'
                label=''
                value={fieldInput}
                onChange={e => setFieldInput(e.target.value)}
              />
            </div>
            <div className={classes.buttonRow}>
              <LinkButton
                onClick={collapse}
              >
                {t('button.cancel', {ns: 'common'})}
              </LinkButton>
              <TertiaryButton
                spacing='wide'
                onClick={async () => {
                  if (fieldInput === 'DELETE') {
                    onDelete()
                  }
                }}
                disabled={fieldInput !== 'DELETE'}
              >
                {t('button.delete', {ns: 'common'})}
              </TertiaryButton>
            </div>
          </div>
        )}
      </StandardModal>
    </UiThemeProvider>
  )
}

export {
  DeleteProjectModal,
}
