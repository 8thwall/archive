import React, {Suspense, useState} from 'react'
import {Modal, Button, Header} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import userActions from '../user/user-actions'
import {TOS_CURRENT_VERSION} from '../../shared/tos'
import useActions from '../common/use-actions'
import {
  almostBlack, brandWhite, gray0, gray4, headerSanSerif, tinyViewOverride,
} from '../static/styles/settings'
import {combine} from '../common/styles'
import withTranslationLoaded from '../i18n/with-translations-loaded'
import {Loader} from '../ui/components/loader'
import {useCurrentUser} from '../user/use-current-user'

const ToSRenderer = React.lazy(() => import('./tos-renderer'))

const useStyles = createUseStyles({
  container: {
    'width': '600px !important',
    'height': '600px',

    [tinyViewOverride]: {
      width: 'auto !important',
      height: '500px',
      margin: '0 2rem !important',
    },
  },
  header: {
    fontFamily: `${headerSanSerif} !important`,
    fontWeight: '900',
    fontSize: '20px !important',
  },

  tosContainer: {
    'backgroundColor': `${gray0} !important`,
    'color': almostBlack,
    'margin': '0 1rem',
    'width': 'auto !important',
    'height': '78%',
    'overflowY': 'scroll',

    '&::-webkit-scrollbar': {
      width: '0.5em',
    },
    '&::-webkit-scrollbar-thumb': {
      background: gray4,
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
      borderRadius: '4px',
    },

    '& h2': {
      fontWeight: 'normal',
      fontSize: '1.3em',
      margin: '0 0 1em 0',
    },
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
  noBorderAndWhiteBkG: {
    border: 'none !important',
    backgroundColor: `${brandWhite} !important`,
  },
})
const TermsOfService = () => {
  const [agreeToSButtonDisabled, setAgreeToSButtonDisabled] = useState(true)

  const {agreeToS} = useActions(userActions)
  const hasTos = useCurrentUser(user => !!user['custom:tos'])
  const classes = useStyles()
  const {t} = useTranslation(['terms-of-service'])

  const headerMessage = hasTos
    ? t('tos_modal.we_updated_terms_and_conditions')
    : t('tos_modal.8th_wall_terms_and_conditions')

  const reachedBottomOfToS = (e) => {
    const {scrollHeight, scrollTop, clientHeight} = e.target
    const bottom = Math.abs(scrollHeight - clientHeight - scrollTop) <= 1
    if (bottom) {
      setAgreeToSButtonDisabled(false)
    }
  }

  return (
    <div>
      <Modal className={classes.container} open size='small'>
        <Header
          className={combine(classes.noBorderAndWhiteBkG, classes.header)}
          textAlign='center'
          content={headerMessage}
        />
        <Modal.Content onScroll={reachedBottomOfToS} className={classes.tosContainer}>
          {/* <Suspense fallback={<div>{t('tos_modal.loading')}</div>}> */}
          <Suspense fallback={<Loader />}>
            <ToSRenderer />
          </Suspense>
        </Modal.Content>
        <Modal.Actions className={combine(classes.center, classes.noBorderAndWhiteBkG)}>
          <Button
            disabled={agreeToSButtonDisabled}
            onClick={() => agreeToS(TOS_CURRENT_VERSION)}
            primary
            content={t('tos_modal.button.i_agree')}
          />
        </Modal.Actions>
      </Modal>
    </div>
  )
}

const TranslatedTermsOfService = withTranslationLoaded(TermsOfService)

export {
  TranslatedTermsOfService as TermsOfService,
}
