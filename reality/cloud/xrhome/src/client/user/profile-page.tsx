import * as React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import Page from '../widgets/page'
import {gray2} from '../static/styles/settings'
import {combine} from '../common/styles'
import withTranslationLoaded from '../i18n/with-translations-loaded'
import {ProfilePageUserForm} from './profile-page-user-form'
import ErrorMessage from '../home/error-message'
import {ConnectedAccountsSettings} from './connected-accounts-settings'
import usePageStyles from '../styles/page-styles'

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '30em',
    margin: '0 auto',
    padding: '2em 0',
    gap: '1em',
  },
  error: {
    maxWidth: '30em',
    margin: '0 auto',
  },
  border: {
    borderTop: `1px solid ${gray2}`,
  },
  nianticProfile: {
    maxWidth: '12em',
    margin: '2em auto',
  },
  lastContainer: {
    marginBottom: '4em',
  },
})

const ProfilePage: React.FC = () => {
  const {t} = useTranslation(['user-profile-page', 'common'])
  const classes = useStyles()
  const pageStyles = usePageStyles()

  return (
    <Page
      className={pageStyles.pageProfile}
      centered={false}
      title={t('user_profile_page.heading_title.user_profile')}
    >
      <ErrorMessage className={classes.error} />
      <ProfilePageUserForm />
      <div className={combine(classes.container, classes.border, classes.lastContainer)}>
        <ConnectedAccountsSettings />
      </div>
    </Page>
  )
}

const TranslatedProfilePage = withTranslationLoaded(ProfilePage)

export default TranslatedProfilePage
