import React, {useState} from 'react'
import {useRouteMatch} from 'react-router-dom'
import {Form} from 'semantic-ui-react'
import {useTranslation, Trans} from 'react-i18next'

import Accordion from '../../widgets/accordion'
import appsActions from '../apps-actions'
import {getRouteApp} from '../../common/paths'
import {AppSetting, AppSettingsGroup} from './app-settings-types'
import {useCollapsibleSettingsGroup} from '../../settings/use-collapsible-settings-group'
import {useSelector} from '../../hooks'
import useActions from '../../common/use-actions'
import {makeHostedStagingUrl} from '../../../shared/hosting-urls'
import useCurrentAccount from '../../common/use-current-account'
import {STAGING_PASSPHRASE_REGEX_PATTERN, isValidPassphrase} from '../../../shared/staging-password'
import LinkOut from '../../uiWidgets/link-out'

const PasscodeSettings: React.FunctionComponent = React.memo(() => {
  const {t} = useTranslation(['app-pages', 'common'])
  const {updateApp} = useActions(appsActions)
  const match = useRouteMatch()
  const app = useSelector(state => getRouteApp(state, match))
  const account = useCurrentAccount()

  const [passphrase, setPassphrase] = useState(app.passphrase || '')
  const {
    expandedSettings,
    toggleSetting,
  } = useCollapsibleSettingsGroup(AppSettingsGroup.PUBLISHER_SETTINGS, [AppSetting.BASIC_INFO])

  const stagingUrl = makeHostedStagingUrl(account.shortName, app.appName)
  const handlePassphraseSubmit = () => {
    updateApp({uuid: app.uuid, passphrase})
  }

  const handlePassphraseChange = (e, {value}) => {
    setPassphrase(value)
  }

  return (
    <Accordion>
      <Accordion.Title
        active={expandedSettings.has(AppSetting.STAGING_PASSCODE)}
        onClick={() => toggleSetting(AppSetting.STAGING_PASSCODE)}
        a8='click;xrhome-project-settings;staging-passcode-accordion'
      >
        {t('project_settings_page.publish_settings.accordion.title.staging_passcode')}
      </Accordion.Title>
      <Accordion.Content>
        <p>
          <Trans
            ns='app-pages'
            i18nKey='project_settings_page.publish_settings.passcode_description'
            components={{
              2: <LinkOut url={stagingUrl} />,
            }}
            values={{url: stagingUrl}}
          />
        </p>
        <p>
          {t('project_settings_page.publish_settings.passcode_requirements')}
        </p>
        <Form onSubmit={handlePassphraseSubmit}>
          <Form.Group inline>
            <Form.Input
              width={10}
              pattern={STAGING_PASSPHRASE_REGEX_PATTERN}
              value={passphrase}
              name='passphrase'
              onChange={handlePassphraseChange}
            />
            <Form.Button
              width={1}
              disabled={
              passphrase === app.passphrase || !isValidPassphrase(passphrase)
            }
              primary
            >{t('button.update', {ns: 'common'})}
            </Form.Button>
          </Form.Group>
        </Form>
      </Accordion.Content>
    </Accordion>
  )
})

export default PasscodeSettings
