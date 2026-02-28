import React from 'react'
import {useTranslation} from 'react-i18next'

import {useAppPreviewStyles} from './app-preview-utils'
import {createThemedStyles} from '../../ui/theme'
import {combine} from '../../common/styles'
import {FloatingPanelButton} from '../../ui/components/floating-panel-button'
import {StandardStepper, StepperOption} from '../../ui/components/standard-stepper'
import {ComponentTooltip} from '../../studio/ui/component-tooltip'

const useStyles = createThemedStyles(theme => ({
  actionBar: {
    overflowX: 'auto',
    borderBottom: theme.listBoxBorder,
  },
  actionSection: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  infoSection: {
    marginLeft: 'auto',
  },
}))

type VpsEventType = 'location' | 'mesh'

interface IAppPreviewVpsEventBar {
  broadcastSimulatorMessage: (action: string, data?: unknown) => void
}

const AppPreviewVpsEventBar: React.FC<IAppPreviewVpsEventBar> = ({
  broadcastSimulatorMessage,
}) => {
  const appPreviewStyles = useAppPreviewStyles()
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])
  const [selectedEventType, setSelectedEventType] = React.useState<VpsEventType>('location')

  const vpsEventTypeOptions: StepperOption[] = [
    {
      value: 'location',
      textContent: t('editor_page.inline_app_preview.iframe.vps_event_bar.location'),
    },
    {
      value: 'mesh',
      textContent: t('editor_page.inline_app_preview.iframe.vps_event_bar.mesh'),
    },
  ]

  return (
    <div className={combine(appPreviewStyles.appPreviewPlaybar, classes.actionBar)}>
      <span className={classes.actionSection}>
        <StandardStepper
          value={selectedEventType}
          options={vpsEventTypeOptions}
          onChange={value => setSelectedEventType(value as VpsEventType)}
        />
        <FloatingPanelButton
          onClick={() => broadcastSimulatorMessage('SIMULATOR_DISPATCH_LOCATIONSCANNING')}
          disabled={selectedEventType !== 'location'}
        >
          {t('editor_page.inline_app_preview.iframe.vps_event_bar.scanning')}
        </FloatingPanelButton>
        <FloatingPanelButton
          onClick={() => {
            switch (selectedEventType) {
              case 'location':
                broadcastSimulatorMessage('SIMULATOR_DISPATCH_LOCATIONFOUND')
                break
              case 'mesh':
                broadcastSimulatorMessage('SIMULATOR_DISPATCH_MESHFOUND')
                break
              default:
                throw new Error(`Unknown vps event type: ${selectedEventType} found`)
            }
          }}
        >
          {t('editor_page.inline_app_preview.iframe.vps_event_bar.found')}
        </FloatingPanelButton>
        <FloatingPanelButton
          onClick={() => {
            switch (selectedEventType) {
              case 'location':
                broadcastSimulatorMessage('SIMULATOR_DISPATCH_LOCATIONLOST')
                break
              case 'mesh':
                broadcastSimulatorMessage('SIMULATOR_DISPATCH_MESHLOST')
                break
              default:
                throw new Error(`Unknown vps event type: ${selectedEventType} lost`)
            }
          }}
        >
          {t('editor_page.inline_app_preview.iframe.vps_event_bar.lost')}
        </FloatingPanelButton>
      </span>
      <span className={classes.infoSection}>
        <ComponentTooltip
          content={t('editor_page.inline_app_preview.iframe.vps_event_bar.tooltip')}
        />
      </span>
    </div>
  )
}

export {
  AppPreviewVpsEventBar,
}
