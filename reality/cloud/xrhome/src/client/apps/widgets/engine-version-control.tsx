import * as React from 'react'
import {Dropdown, Popup, Icon, Label} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import actions from '../apps-actions'
import {isCommercial, isUnpaidCommercial} from '../../../shared/app-utils'
import {DeemphasizedButton} from '../../widgets/deemphasized-button'
import type {IAccount, IApp} from '../../common/types/models'
import useActions from '../../common/use-actions'
import {brandBlack, brandHighlight, brandWhite, orange} from '../../static/styles/settings'
import {useAvailableXrwebVersions} from '../../common/use-available-xrweb-versions'
import type {VersionChannel} from '../../../shared/xrweb-version-types'
import {isFrozenVersion} from '../../../shared/xrweb-version-access'

const firstLetterToUpperCase = s => s[0].toUpperCase() + s.substr(1)

// js_release -> Release
const formatChannel = name => firstLetterToUpperCase(name.replace('js_', ''))

const useStyles = createUseStyles({
  engineVersionControl: {
    'marginBottom': '1em',
    'display': 'flex',
    'flexWrap': 'wrap',
    'alignItems': 'center',
    'justifyContent': 'left',
    '& .spacer': {
      display: 'inline-block',
      width: '2em',
    },
    '& .ui.label': {
      'marginLeft': '0.5em',
      '&.beta, &.branch, &.dev': {
        color: brandWhite,
      },
      '&.beta': {
        backgroundColor: brandHighlight,
      },
      '&.branch': {
        backgroundColor: orange,
      },
      '&.dev': {
        backgroundColor: orange,
      },
    },
    '& .freeze-button, & .unfreeze-button': {
      'color': [brandBlack, '!important'],
      '&:hover': {
        color: [brandBlack, '!important'],
      },
    },
    '& > *': {
      'marginBottom': '0.5em !important',
      '&:not(:last-child)': {
        marginRight: '1rem !important',
      },
    },
  },
})

interface IEngineVersionControl {
  app: IApp
  account: IAccount
}

const EngineVersionControl: React.FunctionComponent<IEngineVersionControl> = ({app, account}) => {
  const {t} = useTranslation(['app-pages'])
  const {updateApp} = useActions(actions)
  const versions = useAvailableXrwebVersions()
  const classes = useStyles()

  // When version is set to a build number, prevEngine is automatically set server side.
  const setVersion = (version: string) => {
    updateApp({uuid: app.uuid, version})
  }

  const handleChannelChange = (event, data) => {
    if (!data || !data.value) {
      return
    }
    setVersion(data.value)
  }

  const versionFrozen = isFrozenVersion(app.version)
  const appIsCommerical = isCommercial(app) && !isUnpaidCommercial(app)
  const allowFreeze = appIsCommerical || account.is8

  if (versionFrozen) {
    return (
      <div className={classes.engineVersionControl}>
        <span>
          {t('project_settings_page.engine_version_control.frozen_to_version',
            {appVersion: app.version})}
        </span>
        <Popup
          trigger={(
            <DeemphasizedButton
              icon='unlock'
              size='mini'
              className='unfreeze-button'
              content={t('project_settings_page.engine_version_control.button.unfreeze')}
              onClick={() => setVersion('js_release')}
            />
          )}
          content={
              t('project_settings_page.engine_version_control.return_to_latest') +
               (allowFreeze
                 ? ` ${t('project_settings_page.engine_version_control.action_can_be_reversed')}`
                 : '')
            }
          position='top center'
        />
      </div>
    )
  }

  const currentChannel = app.version
  const currentVersion: Partial<VersionChannel> = (
    versions.find(v => v.name === currentChannel) || {}
  )

  const currentBuild = currentVersion.build
  const currentChannelName = formatChannel(currentChannel)
  const canFreeze = allowFreeze && currentVersion.name === 'js_release'

  // To have a rollback, an app must have a prevEngine version, different from the current, and
  // not a version available in the version dropdown.
  const hasRollBack = app.prevEngine &&
      app.prevEngine !== currentBuild &&
      !versions.find(v => v.build === app.prevEngine)

  return (
    <div className={classes.engineVersionControl}>
      <Dropdown
        trigger={(
          <>
            {currentBuild}
            <Label
              className={currentChannelName?.toLowerCase() || ''}
              horizontal
            >
              {currentChannelName}
            </Label>
          </>
        )}
        selectOnNavigation={false}
        value={currentChannel}
        options={versions.map(v => ({
          key: v.name,
          value: v.name,
          content: (
            <>
              {v.name === currentVersion.name
                ? <Icon name='check' />
                : <span className='spacer' />
                }
              {t('project_settings_page.engine_version_control.channel',
                {versionName: formatChannel(v.name)})}
            </>
          ),
        }))}
        onChange={handleChannelChange}
      />
      {canFreeze &&
        <div>
          <Popup
            trigger={(
              <DeemphasizedButton
                icon='lock'
                size='mini'
                className='freeze-button'
                content={t('project_settings_page.engine_version_control.button.freeze')}
                onClick={() => setVersion(currentBuild)}
              />
            )}
            content={t('project_settings_page.engine_version_control.freeze_current_version')}
            position='top center'
          />

          {hasRollBack &&
            <Popup
              style={{textAlign: 'center'}}
              trigger={(
                <DeemphasizedButton
                  className='purple compact'
                  onClick={() => setVersion(app.prevEngine)}
                >
                  <Icon name='redo' />
                  {t('project_settings_page.engine_version_control.button.roll_back')}
                </DeemphasizedButton>
              )}
              content={t('project_settings_page.engine_version_control.app_previously_frozen_to',
                {prevEngine: app.prevEngine})}
              position='top center'
            />
        }
        </div>
      }
    </div>
  )
}

export default EngineVersionControl
