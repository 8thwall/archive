import * as React from 'react'
import {Link} from 'react-router-dom'
import {Header} from 'semantic-ui-react'

import {useTranslation} from 'react-i18next'

import ErrorMessage from '../home/error-message'
import WorkspaceCrumbHeading from '../widgets/workspace-crumb-heading'
import {getPathForAccount, AccountPathEnum} from '../common/paths'
import Page from '../widgets/page'
import {FluidCardContent} from '../widgets/fluid-card'
import useCurrentAccount from '../common/use-current-account'
import useCurrentApp from '../common/use-current-app'

const CodeEditorUpsell: React.FC = () => {
  const account = useCurrentAccount()
  const app = useCurrentApp()
  const {t} = useTranslation(['app-pages'])

  const basicAccountUpsell = (
    <>
      <Header as='h2'>{t('editor_upsell_page.heading')}</Header>
      <p>{t('editor_upsell_page.description')}</p>
      <Link to={getPathForAccount(account, AccountPathEnum.account)}>
        <b>
          {t('editor_upsell_page.upgrade_link')}
        </b>
      </Link>
    </>
  )

  return (
    <Page>
      <WorkspaceCrumbHeading text='Project' account={account} app={app} />

      <ErrorMessage />
      <FluidCardContent>
        <p className='info-paragraph'>{basicAccountUpsell}</p>
      </FluidCardContent>
    </Page>
  )
}

export default CodeEditorUpsell
