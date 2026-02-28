import * as React from 'react'

import {useTranslation} from 'react-i18next'

import type {DeepReadonly} from 'ts-essentials'

import {StandardModal} from '../standard-modal'
import {StandardModalActions} from '../standard-modal-actions'
import {StandardModalHeader} from '../standard-modal-header'
import {LinkButton} from '../../ui/components/link-button'
import {useDismissibleModal} from '../dismissible-modal-context'
import type {GatewayDefinition} from '../../../shared/gateway/gateway-types'
import {ProxyConfigView} from '../backend-config/proxy-config-view'
import {createThemedStyles} from '../../ui/theme'
import {FunctionConfigView} from '../backend-config/function-config-view'

const useStyles = createThemedStyles(theme => ({
  content: {
    padding: '1rem',
    backgroundColor: theme.modalContentBg,
    maxHeight: '70vh',
    overflow: 'auto',
  },
}))

interface IBackendConfigViewModal {
  onClose: () => void
  backendTemplate: DeepReadonly<GatewayDefinition>
}

const BackendConfigViewModal: React.FC<IBackendConfigViewModal> = ({onClose, backendTemplate}) => {
  useDismissibleModal(onClose)
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const classes = useStyles()

  return (
    <StandardModal onClose={onClose}>
      <StandardModalHeader>
        <h2>{t('editor_page.backend_config_view_modal.header')}</h2>
      </StandardModalHeader>
      <div className={classes.content}>
        {backendTemplate.type === 'function'
          ? <FunctionConfigView config={backendTemplate} />
          : <ProxyConfigView config={backendTemplate} />
        }
      </div>
      <StandardModalActions>
        <LinkButton onClick={onClose}>{t('button.close', {ns: 'common'})}</LinkButton>
      </StandardModalActions>
    </StandardModal>
  )
}

export default BackendConfigViewModal
