import React from 'react'
import {createUseStyles} from 'react-jss'
import {Link, useHistory} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import Page from '../widgets/page'
import {headerSanSerif, mobileViewOverride} from '../static/styles/settings'
import {useSelector} from '../hooks'
import {isWebAccount} from '../../shared/account-utils'
import {PrimaryButton} from '../ui/components/primary-button'
import accountActions from '../accounts/account-actions'
import useActions from '../common/use-actions'
import type {IAccount} from '../common/types/models'
import {getPathForAccount} from '../common/paths'
import ErrorMessage from '../home/error-message'

const useStyles = createUseStyles({
  headingText: {
    fontWeight: 900,
    fontFamily: headerSanSerif,
    fontSize: '2.25em',
    lineHeight: '1.25em',
    marginBottom: '0.5em',
    [mobileViewOverride]: {
      fontSize: '2.5em',
    },
  },
})

const CameraRetiredPage: React.FC = () => {
  const classes = useStyles()
  const hasWebWorkspace = useSelector(state => state.accounts.allAccounts.some(isWebAccount))
  const {addAccount} = useActions(accountActions)
  const history = useHistory()
  const {t} = useTranslation(['app-pages'])

  const [loading, setLoading] = React.useState(false)

  const handleFreeAccountCreate = async () => {
    setLoading(true)
    // NOTE(christoph): If there is an error, addAccount returns null
    const account: IAccount | null = await addAccount({accountType: 'WebDeveloper'})
    if (account) {
      history.push(getPathForAccount(account))
    } else {
      setLoading(false)
    }
  }

  return (
    <Page>
      <ErrorMessage />
      <h1 className={classes.headingText}>{t('camera_retired_page.title')}</h1>
      <p>
        {t('camera_retired_page.description')}
      </p>
      <p>
        {hasWebWorkspace
          ? (
            <Link to='/projects'>
              {t('camera_retired_page.call_to_action.project_library')}
            </Link>
          )
          : (
            <PrimaryButton
              loading={loading}
              onClick={handleFreeAccountCreate}
            >
              {t('camera_retired_page.call_to_action.start_for_free')}
            </PrimaryButton>
          ) }
      </p>
    </Page>
  )
}

export {
  CameraRetiredPage,
}
