import React from 'react'
import {useDispatch} from 'react-redux'
import {Link, useHistory, useRouteMatch} from 'react-router-dom'
import {Checkbox} from 'semantic-ui-react'
import {useTranslation, Trans} from 'react-i18next'

import Accordion from '../../widgets/accordion'
import CollapsibleSettingsGroup from '../../settings/collapsible-settings-group'
import {isLegacyPro} from '../../../shared/account-utils'
import {
  getPathForAccount, getRouteAccount, AppPathEnum, getPathForApp, getRouteApp,
} from '../../common/paths'
import {rawActions as actions} from '../apps-actions'
import {isCommercial, isUnpaidCommercial, isEntryWebApp} from '../../../shared/app-utils'
import {AppSetting, AppSettingsGroup} from './app-settings-types'
import {useCollapsibleSettingsGroup} from '../../settings/use-collapsible-settings-group'
import {useSelector} from '../../hooks'
import {errorAction} from '../../common/error-action'
import {DeleteProjectModal} from './delete-project-modal'
import {DangerButton} from '../../ui/components/danger-button'

const DangerZoneSettings: React.FunctionComponent = React.memo(() => {
  const {t} = useTranslation(['app-pages'])
  const dispatch = useDispatch()
  const history = useHistory()
  const match = useRouteMatch()
  const account = useSelector(state => getRouteAccount(state, match))
  const app = useSelector(state => getRouteApp(state, match))
  const isAppEntryWebApp = isEntryWebApp(account, app)

  const {
    expandedSettings,
    areAllSettingsExpanded,
    toggleSetting,
    expandAllSettings,
    collapseAllSettings,
  } = useCollapsibleSettingsGroup(AppSettingsGroup.DANGER_ZONE)

  const isDisabled = app.status === 'DISABLED'
  const appIsCommerical = isCommercial(app) && !isUnpaidCommercial(app)
  const allowDelete = !appIsCommerical

  const tempDisableCamera =
    t('project_settings_page.danger_zone_settings.description.disabled_unavailable_to_view')
  const tempDisableContent = isLegacyPro(account) || appIsCommerical
    ? t('project_settings_page.danger_zone_settings.description.disabled_no_access_and_views')
    : t('project_settings_page.danger_zone_settings.description.disabled_no_access')
  const onDelete = async () => {
    try {
      await dispatch(actions.deleteAppImmediate(app))
      history.push(getPathForAccount(account))
    } catch (err) {
      dispatch(errorAction(err.message))
    }
  }

  return (
    <CollapsibleSettingsGroup
      header={t('project_settings_page.danger_zone_settings.collapsible_group.header')}
      showCollapseAll={areAllSettingsExpanded}
      onExpandAllClick={expandAllSettings}
      onCollapseAllClick={collapseAllSettings}
    >
      {!isAppEntryWebApp &&
        <Accordion collapsable={false}>
          <Accordion.Title
            active={expandedSettings.has(AppSetting.DISABLE_PROJECT)}
            onClick={() => toggleSetting(AppSetting.DISABLE_PROJECT)}
            a8='click;xrhome-project-settings;temporarily-disable-project-accordian'
          >
            {t('project_settings_page.danger_zone_settings.title.temporary_disable')}
          </Accordion.Title>
          <Accordion.Content>
            <p>
              {app.isCamera ? tempDisableCamera : tempDisableContent}
            </p>
            {appIsCommerical &&
              <p>
                {t('project_settings_page.danger_zone_settings.description.commercial_charge')}
              </p>
            }
            <Checkbox
              toggle
              className='cherry'
              checked={isDisabled}
              onClick={() => dispatch(actions.updateApp({
                uuid: app.uuid,
                status: isDisabled ? 'ENABLED' : 'DISABLED',
              }))}
            />

            {isDisabled &&
              <p className='error'>
                {t('project_settings_page.danger_zone_settings.is_temp_disabled')}
              </p>
            }
          </Accordion.Content>
        </Accordion>
      }

      <Accordion>
        <Accordion.Title
          active={expandedSettings.has(AppSetting.DELETE_PROJECT)}
          onClick={() => toggleSetting(AppSetting.DELETE_PROJECT)}
          a8='click;xrhome-project-settings;delete-project-accordian'
        >
          {t('project_settings_page.danger_zone_settings.title.delete_project')}
        </Accordion.Title>
        <Accordion.Content>
          {!allowDelete &&
            <p className='error'>
              <Trans
                ns='app-pages'
                i18nKey='project_settings_page.danger_zone_settings.link.cannot_delete_commercial'
                components={{
                  1: <Link
                    className='inline-link'
                    to={getPathForApp(account, app, AppPathEnum.project)}
                  />,
                }}
              />
            </p>
          }
          <DeleteProjectModal
            onDelete={onDelete}
            trigger={(
              <DangerButton
                height='small'
                disabled={!allowDelete}
              >
                {t('project_settings_page.danger_zone_settings.button.delete')}
              </DangerButton>
            )}
          />
        </Accordion.Content>
      </Accordion>
    </CollapsibleSettingsGroup>
  )
})

export default DangerZoneSettings
