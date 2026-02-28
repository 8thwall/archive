import React from 'react'
import {useTranslation, Trans} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {PrimaryButton} from '../../ui/components/primary-button'
import {FloatingTrayModal} from '../../ui/components/floating-tray-modal'

const useStyles = createUseStyles({
  vpsWarning: {
    maxWidth: '80%',
    margin: '2em',
    display: 'flex',
    flexDirection: 'column',
    gap: '2em',
    textAlign: 'center',
  },
})

const AppPreviewVpsUnavailableModal: React.FC<{}> = () => {
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])

  return (
    <FloatingTrayModal startOpen trigger={undefined}>
      {collapse => (
        <div className={classes.vpsWarning}>
          <Trans
            ns='cloud-editor-pages'
            i18nKey='editor_page.inline_app_preview.iframe.vps_warning.text'
            components={{1: <br />}}
          />
          <PrimaryButton onClick={collapse}>
            {t('editor_page.inline_app_preview.iframe.vps_warning.button')}
          </PrimaryButton>
        </div>
      )}
    </FloatingTrayModal>
  )
}

export {
  AppPreviewVpsUnavailableModal,
}
