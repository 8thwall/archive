import React from 'react'
import {useTranslation} from 'react-i18next'

import {StandardDropdownField} from '../../ui/components/standard-dropdown-field'
import type {DropdownOption, DropdownSection} from '../../ui/components/core-dropdown'
import {
  useAppPreviewStyles, ACTION_BUTTON_TEXT_MIN_WIDTH, MIN_PREVIEW_HEIGHT, MIN_PREVIEW_WIDTH,
  SectionData, SequenceOptionData, VisibleContent, makeSection, makeSequenceOption, Sequence,
  LocationOptionData, makeLocationOption,
} from './app-preview-utils'
import {Icon, IconColor, IconStroke} from '../../ui/components/icon'
import {combine} from '../../common/styles'
import {createThemedStyles} from '../../ui/theme'
import {StandardStepper, StepperOption} from '../../ui/components/standard-stepper'
import {AppPreviewPlaybar} from './app-preview-playbar'
import {brandBlack, darkMango, mango} from '../../static/styles/settings'
import {useSimulator} from './use-simulator-state'
import type {WayfarerPoi} from '../../../shared/integration/titan-api/titan-api'
import type {EntityLocation} from '../../studio/hooks/use-scene-locations'
import {useAppImageTargets, type ImageTarget} from '../../studio/hooks/use-app-image-targets'
import {Tooltip} from '../../ui/components/tooltip'
import {FloatingTrayCheckboxInput} from '../../ui/components/floating-tray-checkbox-input'
import {StandardFieldLabel} from '../../ui/components/standard-field-label'
import {AppPreviewVpsEventBar} from './app-preview-vps-event-bar'
import {isCloudStudioApp} from '../../../shared/app-utils'
import useCurrentApp from '../../common/use-current-app'
import {ImageTargetLoader} from '../../image-targets/image-target-loader'
import {useImageTarget} from '../../studio/hooks/use-image-target'

const useStyles = createThemedStyles(theme => ({
  textButton: {
    'cursor': 'pointer',
    'borderRadius': '4px',
    'padding': '0 0.5rem',
    'display': 'inline-flex',
    'gap': '0.25rem',
    'alignItems': 'center',
    'border': `1px solid ${theme.fgMuted}`,
    'color': theme.fgMuted,
    'height': '24px',
    '&:hover[aria-pressed=true]': {
      color: brandBlack,
      border: 'none',
      backgroundColor: darkMango,
    },
    '&:not(:hover)[aria-pressed=true]': {
      color: brandBlack,
      border: 'none',
      backgroundColor: mango,
    },
    '&:hover[aria-pressed=false]': {
      color: theme.fgMain,
      borderColor: theme.fgMain,
      backgroundColor: theme.listItemHoverBg,
    },
  },
  rightContent: {
    display: 'flex',
    marginLeft: 'auto',
    gap: '0.5rem',
  },
  vpsInfo: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  manualEventsCheckbox: {
    display: 'flex',
  },
}))

interface IActionButton {
  text?: string
  iconColor?: IconColor
  icon: IconStroke
  active: boolean
  onClick: () => void
  textVisible: boolean
}

const ActionButton: React.FC<IActionButton> = ({
  text, iconColor, icon, active, onClick, textVisible,
}) => {
  const classes = useStyles()
  return (
    <button
      type='button'
      className={combine('style-reset', classes.textButton)}
      onClick={onClick}
      aria-pressed={active}
      aria-label={text}
    >
      <Icon stroke={icon} color={(iconColor && active) ? iconColor : undefined} />
      {textVisible && text}
    </button>
  )
}

interface IAppPreviewBottomBar {
  selectedSequence?: Sequence
  selectedVariation?: string
  sequences: Sequence[]
  simulatorId: string
  broadcastSimulatorMessage: (action: string, data: unknown) => void
  maxDropdownHeight?: number
  maxDropdownWidth?: number
  containerHeight?: number
  containerWidth?: number
  hideLiveView?: boolean
  selectedLocationId?: string
  locations?: EntityLocation[]
  targetsGalleryUuid?: string
  selectedImageTargetName?: string
  showVpsUnavailable?: boolean
  vpsEnabled?: boolean
}

const AppPreviewBottomBar: React.FC<IAppPreviewBottomBar> = ({
  selectedSequence, sequences, simulatorId, broadcastSimulatorMessage, selectedVariation,
  maxDropdownHeight, maxDropdownWidth, containerHeight, containerWidth, hideLiveView,
  selectedLocationId, locations, showVpsUnavailable, vpsEnabled, targetsGalleryUuid,
  selectedImageTargetName,
}) => {
  const classes = useStyles()
  const appPreviewStyles = useAppPreviewStyles()
  const {t} = useTranslation(['cloud-editor-pages', 'app-pages'])

  const {simulatorState, updateSimulatorState} = useSimulator()
  const targets = useAppImageTargets(targetsGalleryUuid)
  const [selectedTarget] = useImageTarget(selectedImageTargetName)
  if (selectedTarget && !targets.find(({name}) => name === selectedTarget.name)) {
    targets.push({
      name: selectedTarget.name,
      translatedType: {
        'PLANAR': t('image_target_page.label.flat', {ns: 'app-pages'}),
        'CYLINDER': t('image_target_page.label.cylindrical', {ns: 'app-pages'}),
        'CONICAL': t('image_target_page.label.conical', {ns: 'app-pages'}),
      }[selectedTarget.type],
      type: selectedTarget.type,
      imageUrl: selectedTarget.imageSrc,
      originalImageUrl: selectedTarget.geometryTextureImageSrc || selectedTarget.originalImageSrc,
      metadata: selectedTarget.metadata,
    })
  }

  const isLiveView = !!simulatorState?.isLiveView
  const isManualVpsEvents = !!simulatorState?.manualVpsEvents

  const variations = selectedSequence?.variations
  const variationKeys = variations ? Object.keys(variations) : []
  const variationOptions: StepperOption[] = variationKeys.map(name => (
    {value: name, textContent: name}
  ))

  const visibleSequences = isCloudStudioApp(useCurrentApp())
    ? sequences?.filter(item => item.section !== 'IMAGE_TARGETS') ?? []
    : sequences ?? []

  const sequenceOptionData: SequenceOptionData[] = visibleSequences.map(item => ({
    name: item.name,
    section: item.section,
    rightContent: item.tag,
  }))

  const locationOptionsData: LocationOptionData[] = locations?.map(({name, poi}) => ({
    name,
    section: 'VPS_LOCATION',
    rightContent: t('editor_page.inline_app_preview.iframe.sequence_dropdown.option_tag.location'),
    poiId: poi.id,
  })) ?? []

  const imageTargetOptionsData: SequenceOptionData[] = targets?.map(({name, translatedType}) => ({
    name,
    section: 'IMAGE_TARGETS',
    rightContent: translatedType,
  })) ?? []

  const sequenceOptions: DropdownOption[] = sequenceOptionData.map(makeSequenceOption)
  const locationOptions: DropdownOption[] = locationOptionsData.map(makeLocationOption)
  const imageTargetOptions: DropdownOption[] = imageTargetOptionsData.map(makeSequenceOption)
  sequenceOptions.push(...locationOptions)

  const getLocationPoi = (poiId: string): WayfarerPoi => (
    locations?.find(({poi}) => poi.id === poiId)?.poi
  )

  const getImageTarget = (name: string): ImageTarget => (
    targets?.find(target => target.name === name)
  )

  const getLocationTitle = (poiId: string): string => (
    locationOptionsData?.find(poi => poi.poiId === poiId)?.name
  )

  const sequenceSectionData: SectionData[] = [
    {
      key: 'WORLD',
      textContent: t(
        'editor_page.inline_app_preview.iframe.sequence_dropdown.section_name.world_tracking'
      ),
      stroke: 'world',
    },
    {
      key: 'PEOPLE',
      textContent: t('editor_page.inline_app_preview.iframe.sequence_dropdown.section_name.people'),
      stroke: 'people',
    },
  ]

  if (visibleSequences.some(item => item.section === 'IMAGE_TARGETS')) {
    sequenceSectionData.push({
      key: 'IMAGE_TARGETS',
      textContent: t(
        'editor_page.inline_app_preview.iframe.sequence_dropdown.section_name.targets'
      ),
      stroke: 'targets',
    })
  } else {
    sequenceSectionData.push({
      key: 'IMAGE_TARGETS',
      textContent: t(
        'editor_page.inline_app_preview.iframe.sequence_dropdown.section_name.targets'
      ),
      stroke: 'targets',
      loadMoreNode: (
        <ImageTargetLoader galleryUuid={targetsGalleryUuid} />
      ),
    })
    sequenceOptions.push(...imageTargetOptions)
  }

  if (locations || showVpsUnavailable) {
    sequenceSectionData.unshift({
      key: 'VPS_LOCATION',
      textContent: t(
        'editor_page.inline_app_preview.iframe.sequence_dropdown.section_name.locations'
      ),
      stroke: 'vpsLocation',
      info: showVpsUnavailable && t(
        'editor_page.inline_app_preview.iframe.sequence_dropdown.section_info.vps_unavailable'
      ),
    })
  }

  const sequenceSections: DropdownSection[] = sequenceSectionData.map(makeSection)

  const getVisibleSequenceContent = (option: DropdownOption): React.ReactNode => {
    const location = getLocationPoi(option.value)
    return (
      <VisibleContent
        option={option}
        sectionData={sequenceSectionData}
        textContent={location ? getLocationTitle(option.value) : option.value}
      />
    )
  }

  const handleOptionChange = (value: string) => {
    const location = getLocationPoi(value)
    const imageTarget = getImageTarget(value)

    updateSimulatorState({
      sequence: location || imageTarget ? '' : value,
      mockCoordinateValue: location ? location.id : simulatorState.mockCoordinateValue,
      variation: null,
      start: 0,
      end: 1,
      isPaused: false,
      poiId: location ? location.id : null,
      imageTargetName: imageTarget?.name,
      imageTargetType: imageTarget?.type,
      imageTargetOriginalUrl: imageTarget?.originalImageUrl,
      imageTargetMetadata: imageTarget?.metadata,
      manualVpsEvents: simulatorState?.manualVpsEvents ?? true,
    })
  }

  const handleVariationChange = (variation: string) => {
    updateSimulatorState({
      sequence: selectedSequence.name, variation, start: 0, end: 1, isPaused: false,
    })
  }

  const sequenceDropdown = (
    <div className={appPreviewStyles.dropdown}>
      <StandardDropdownField
        label=''
        id='sequenceDropdown'
        height='tiny'
        options={sequenceOptions}
        value={selectedLocationId || selectedImageTargetName || selectedSequence?.name || ''}
        onChange={handleOptionChange}
        sections={sequenceSections}
        width='maxContent'
        formatVisibleContent={getVisibleSequenceContent}
        disabled={isLiveView}
        maxHeight={maxDropdownHeight}
        maxWidth={maxDropdownWidth}
        positionAbove
        shouldReposition={false}
      />
    </div>
  )

  // Note(juliesoohoo): This may change to be a dropdown in the future, but currently this is
  // a text field for informational purposes only.
  const keyControlsInfoField = (
    <Tooltip content={(
      <span style={{textAlign: 'center', display: 'block'}}>
        {t('editor_page.inline_app_preview.iframe.key_controls_info')}
      </span>
    )}
    >
      <div className={classes.vpsInfo}>
        <Icon stroke='keyControls' color='gray4' />
        <StandardFieldLabel
          label='WASD'
          mutedColor
        />
      </div>
    </Tooltip>
  )

  const manualCheckId = 'manual-event-checkbox'
  const manualVpsEventsCheckbox = (
    <Tooltip
      position='top-end'
      content={(
        <span>
          {vpsEnabled
            ? t('editor_page.inline_app_preview.iframe.vps_manual_events.check.tooltip')
            : t('editor_page.inline_app_preview.iframe.vps_manual_events.check_disabled.tooltip')}
        </span>
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={manualCheckId} className={classes.manualEventsCheckbox}>
        <FloatingTrayCheckboxInput
          id={manualCheckId}
          checked={vpsEnabled && isManualVpsEvents}
          onChange={(e) => {
            updateSimulatorState({manualVpsEvents: e.target.checked})
          }}
          disabled={!vpsEnabled}
        />
        <StandardFieldLabel
          id='manual-event-checkbox-label'
          label={t('editor_page.inline_app_preview.iframe.vps_manual_events')}
          mutedColor={!vpsEnabled}
        />
      </label>
    </Tooltip>
  )

  if (containerHeight < MIN_PREVIEW_HEIGHT * 1.1 && containerWidth < MIN_PREVIEW_WIDTH * 1.1) {
    return (
      <div className={appPreviewStyles.previewActions}>
        <div className={appPreviewStyles.selectionContainer}>
          {sequenceDropdown}
          {!isLiveView && !selectedImageTargetName && <AppPreviewPlaybar
            simulatorId={simulatorId}
            broadcastSimulatorMessage={broadcastSimulatorMessage}
          />}
        </div>
      </div>
    )
  }

  return (
    <>
      {(!isLiveView && !selectedImageTargetName && !selectedLocationId) && <AppPreviewPlaybar
        simulatorId={simulatorId}
        broadcastSimulatorMessage={broadcastSimulatorMessage}
      />}
      {selectedLocationId && isManualVpsEvents && (
        <AppPreviewVpsEventBar broadcastSimulatorMessage={broadcastSimulatorMessage} />
      )}
      <div className={appPreviewStyles.previewActions}>
        <div className={appPreviewStyles.selectionContainer}>
          {sequenceDropdown}
          {(selectedLocationId || selectedImageTargetName) && keyControlsInfoField}
          {variations && !selectedLocationId && !selectedImageTargetName &&
            <StandardStepper
              value={selectedVariation}
              options={variationOptions}
              onChange={handleVariationChange}
              disabled={variationKeys.length <= 1 || isLiveView}
            />
          }
        </div>
        {!hideLiveView && !selectedLocationId && !selectedImageTargetName && (
          <div className={classes.rightContent}>
            <ActionButton
              text={t('editor_page.inline_app_preview.iframe.live_view_button.text')}
              icon='liveView'
              active={isLiveView}
              onClick={() => updateSimulatorState({isLiveView: !isLiveView})}
              textVisible={containerWidth >= ACTION_BUTTON_TEXT_MIN_WIDTH}
            />
          </div>
        )}
        {selectedLocationId && manualVpsEventsCheckbox}
      </div>
    </>
  )
}

export {
  AppPreviewBottomBar,
}
