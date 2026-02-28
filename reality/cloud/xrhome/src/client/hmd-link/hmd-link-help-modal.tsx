import React from 'react'
import {Modal} from 'semantic-ui-react'
import {Trans, useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'
import {Link} from 'react-router-dom'

import {brandWhite, gray4, headerSanSerif} from '../static/styles/settings'

const useStyles = createUseStyles({
  HmdLinkHelpModal: {
    'fontFamily': headerSanSerif,
    'fontSize': '16px !important',
    'fontWeight': '400 !important',
    'lineHeight': '20px !important',
    '& ol': {
      marginBlockStart: '0',
      marginBlockEnd: '0',
      paddingInlineStart: '1.4em',
    },
  },
  underscore: {
    'fontWeight': 700,
    'color': brandWhite,
    'textDecoration': 'underline',
    'cursor': 'default',
    '&:link, &:visited, &:active': {
      color: brandWhite,
    },
    '&:hover': {
      color: gray4,
      textDecoration: 'underline',
    },
  },
  header: {
    fontWeight: '700',
    fontSize: '24px !important',
    lineHeight: '32px !important',
  },
})

interface HmdLinkHelpModalProps {
  setOpen: (open: boolean) => void
}

const Underscore: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const classes = useStyles()
  return (
    <Link to='/login' className={classes.underscore}>
      {children}
    </Link>
  )
}

const HmdLinkHelpModal: React.FC<HmdLinkHelpModalProps> = ({setOpen}) => {
  const classes = useStyles()
  const {t} = useTranslation(['hmd-link-page'])
  return (
    <Modal
      basic
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open
      size='small'
    >
      <Modal.Content className={classes.HmdLinkHelpModal}>
        <h2 className={classes.header}>{t('page.modal.help.project_not_appearing.title')}</h2>
        <p>{t('page.modal.help.project_not_appearing.instruction')}</p>
        <ol>
          <li>
            <Trans
              ns='hmd-link-page'
              i18nKey='page.modal.help.project_not_appearing.step1'
              components={{1: <Underscore />}}
            />
          </li>
          <li>{t('page.modal.help.project_not_appearing.step2')}</li>
          <li>{t('page.modal.help.project_not_appearing.step3')}</li>
        </ol>
        <h2 className={classes.header}>{t('page.modal.help.how_it_works.title')}</h2>
        <Trans
          ns='hmd-link-page'
          i18nKey='page.modal.help.how_it_works.instruction'
        />
        <h2 className={classes.header}>{t('page.modal.help.how_to_turn_it_off.title')}</h2>
        <p>{t('page.modal.help.how_to_turn_it_off.instruction')}</p>
      </Modal.Content>
    </Modal>
  )
}

export {HmdLinkHelpModal}
