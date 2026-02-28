import * as React from 'react'
import {Form, Checkbox, Divider, Label, Modal, Popup, Icon} from 'semantic-ui-react'
import {TwitterPicker} from 'react-color'
import {useTranslation, Trans} from 'react-i18next'

import {IconPreview} from './icon-preview'
import {
  MAX_PWA_ICON_HEIGHT,
  MAX_PWA_ICON_WIDTH,
  MAX_PWA_APP_NAME_LENGTH,
  MAX_PWA_APP_SHORT_NAME_LENGTH,
  DEFAULT_PWA_BACKGROUND_COLOR,
  DEFAULT_PWA_THEME_COLOR,
  DEFAULT_PWA_ICON_ID,
} from '../../../shared/pwa-constants'
import {getContrastFontColor} from '../../../shared/colors'
import {PWA_ICON_SIZES} from '../../../shared/pwa-constants'
import {derivePwaIconUrls} from '../../../shared/pwa-utils'
import actions, {PwaActions} from '../../pwa/pwa-actions'
import {goDocs} from '../../common'
import {Loader} from '../../ui/components/loader'
import '../../static/styles/index.scss'
import '../../static/styles/pwa-settings.scss'
import colorPickerIcon from '../../static/color-picker-icon.png'
import ImageCropModal from './image-crop-modal'
import PwaExampleCode from './pwa-example-code'
import Accordion from '../../widgets/accordion'
import {useGitDeployments, useHasNonDevDeployment} from '../../git/hooks/use-deployment'
import useActions from '../../common/use-actions'
import type {IApp} from '../../common/types/models'
import {PrimaryButton} from '../../ui/components/primary-button'
import {TertiaryButton} from '../../ui/components/tertiary-button'

const ACCEPTED_FILE_TYPES = 'image/png'

const EditPwaSettingsCard = ({app, active, onTitleClick}) => {
  const {t} = useTranslation(['app-pages'])
  const {updatePwaEnabled, updatePwaInfo} = useActions(actions)
  const [pwaEnabled, setPwaEnabled] = React.useState(app.hasPwaEnabled)
  const [updatingEnabled, setUpdatingEnabled] = React.useState(false)
  const [repblishModalOpen, setRepublishModalOpen] = React.useState(false)

  const needsRepublish = useHasNonDevDeployment(app.repoId)

  React.useEffect(() => {
    setPwaEnabled(app.hasPwaEnabled)
    setUpdatingEnabled(false)
  }, [app.hasPwaEnabled])

  const togglePwaEnabled = () => {
    const originalValue = pwaEnabled
    setPwaEnabled(!pwaEnabled)
    setUpdatingEnabled(true)
    setRepublishModalOpen(false)
    updatePwaEnabled(app.uuid, !pwaEnabled)
      .catch((e) => {
        // TODO(alvin): Should probably display an error here.
        console.error(e)
        setPwaEnabled(originalValue)
        setUpdatingEnabled(false)
      })
  }

  const onEnabledChange = () => {
    if (needsRepublish) {
      setRepublishModalOpen(true)
    } else {
      togglePwaEnabled()
    }
  }

  const toggleLabel = pwaEnabled
    ? t('project_settings_page.edit_pwa_settings_card.enabled')
    : t('project_settings_page.edit_pwa_settings_card.disabled')
  return (
    <Accordion className='pwa-settings-card'>
      <Accordion.Title
        active={active}
        onClick={onTitleClick}
        a8='click;xrhome-project-settings;progressive-web-app-accordian'
      >
        {t('project_settings_page.edit_pwa_settings_card.heading')}{' '}
        <Label className='pwa-beta-label'>BETA</Label>
      </Accordion.Title>
      <Accordion.Content>
        <p>
          <Trans
            ns='app-pages'
            i18nKey='project_settings_page.edit_pwa_settings_card.content'
          >
            Progressive Web Apps (PWAs) use modern web capabilities to offer users an experience
            that&apos;s similar to a native application. This feature allows you to create a PWA
            version of your project so that users can add it to their home screen, although users
            must still be connected to the internet in order to access it. Learn more about PWAs
            and their limitations in our&nbsp;
            <a
              target='_blank'
              rel='noopener noreferrer'
              href={goDocs('guides/advanced-topics/progressive-web-apps/')}
            >
              documentation
            </a>.
          </Trans>
        </p>
        <Form>
          <Form.Field>
            <Checkbox toggle checked={pwaEnabled} onChange={onEnabledChange} label={toggleLabel} />
            {/* eslint-disable-next-line local-rules/ui-component-styling */}
            {!!updatingEnabled && <Loader inline size='small' className='enabled-loader' />}
          </Form.Field>
        </Form>

        <RepublishModal
          open={repblishModalOpen}
          onCancel={() => setRepublishModalOpen(false)}
          onConfirm={togglePwaEnabled}
        />

        <Divider />
        <PwaSettingsEditor
          app={app}
          disabled={!pwaEnabled || updatingEnabled}
          updatePwaInfo={updatePwaInfo}
        />
        { pwaEnabled && <PwaExampleCode /> }
      </Accordion.Content>
    </Accordion>
  )
}

const getSmallestIconUrl = (iconId) => {
  const iconUrls = derivePwaIconUrls(iconId || DEFAULT_PWA_ICON_ID)
  const smallestSize = PWA_ICON_SIZES[0]
  return iconUrls[smallestSize]
}

interface IPwaSettingsEditor {
  app: IApp
  disabled: boolean
  updatePwaInfo: PwaActions['updatePwaInfo']
}

const PwaSettingsEditor: React.FC<IPwaSettingsEditor> = ({app, disabled, updatePwaInfo}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const pwaInfo = app.PwaInfo
  const [iconPreview, setIconPreview] = React.useState(getSmallestIconUrl(pwaInfo?.iconId))
  const [cropResult, setCropResult] = React.useState(null)
  const [updating, setUpdating] = React.useState(false)
  const [appName, setAppName] = React.useState(pwaInfo?.name || '')
  const [appShortName, setAppShortName] = React.useState(pwaInfo?.shortName || '')
  const [backgroundColor, setBackgroundColor] = React.useState(
    pwaInfo?.backgroundColor || DEFAULT_PWA_BACKGROUND_COLOR
  )
  const [themeColor, setThemeColor] = React.useState(
    pwaInfo?.themeColor || DEFAULT_PWA_THEME_COLOR
  )
  const [repblishModalOpen, setRepublishModalOpen] = React.useState(false)

  const deployment = useGitDeployments(app.repoId)

  React.useEffect(() => {
    resetForm()
  }, [pwaInfo])

  const resetForm = () => {
    setIconPreview(getSmallestIconUrl(pwaInfo?.iconId))
    setCropResult(null)
    setAppName(pwaInfo?.name || '')
    setAppShortName(pwaInfo?.shortName || '')
    setBackgroundColor(pwaInfo?.backgroundColor || DEFAULT_PWA_BACKGROUND_COLOR)
    setThemeColor(pwaInfo?.themeColor || DEFAULT_PWA_THEME_COLOR)
  }
  const disableUpdateButtons = () => {
    if (disabled || updating) {
      return true
    }

    return iconPreview === getSmallestIconUrl(pwaInfo?.iconId) &&
      appName === (pwaInfo?.name || '') &&
      appShortName === (pwaInfo?.shortName || '') &&
      backgroundColor === (pwaInfo?.backgroundColor || DEFAULT_PWA_BACKGROUND_COLOR) &&
      themeColor === (pwaInfo?.themeColor || DEFAULT_PWA_THEME_COLOR)
  }
  const savePwaInfo = () => {
    const params = {
      name: appName,
      shortName: appShortName,
      backgroundColor,
      themeColor,
      file: cropResult && cropResult.original.file,
      crop: cropResult && cropResult.cropAreaPixels,
    }
    setUpdating(true)
    setRepublishModalOpen(false)
    updatePwaInfo(app.uuid, params, deployment)
      .then(() => setUpdating(false))
      .catch(e => setUpdating(false))
  }
  const onSaveClick = () => {
    if (needsRepublish) {
      setRepublishModalOpen(true)
    } else {
      savePwaInfo()
    }
  }

  const onBackgroundColorChange = color => setBackgroundColor(color.hex.toUpperCase())
  const onThemeColorChange = color => setThemeColor(color.hex.toUpperCase())
  const onIconChange = (icon, cropResult) => {
    setIconPreview(icon)
    setCropResult(cropResult)
  }
  const onAppNameChange = e => setAppName(e.target.value)
  const onShortNameChange = e => setAppShortName(e.target.value)

  const getSaveButtonText = () => {
    if (deployment?.production) {
      return t('project_settings_page.button.save_republish')
    } else if (deployment?.staging) {
      return t('project_settings_page.button.save_republish_staging')
    } else {
      return t('button.save', {ns: 'common'})
    }
  }
  const needsRepublish = deployment?.production || deployment?.staging

  const themeColorTitle = (
    <label>
      {t('project_settings_page.pwa_settings_editor.label.theme_color_title')}&nbsp;
      <Popup
        content={t('project_settings_page.pwa_settings_editor.popup.theme_color_title')}
        trigger={<Icon name='question circle' />}
      />
    </label>
  )

  return (
    <Form>
      <Form.Field disabled={disabled}>
        <label htmlFor='inputAppName'>
          {t('project_settings_page.pwa_settings_editor.label.name')}
        </label>
        <p>{t('project_settings_page.pwa_settings_editor.description.name')}</p>
        <input
          name='inputAppName'
          placeholder={t('project_settings_page.pwa_settings_editor.placeholder.name')}
          value={appName}
          onChange={onAppNameChange}
          maxLength={MAX_PWA_APP_NAME_LENGTH}
        />
      </Form.Field>
      <Form.Field disabled={disabled}>
        <label htmlFor='inputShortName'>
          {t('project_settings_page.pwa_settings_editor.label.short_name')}
        </label>
        <p>{t('project_settings_page.pwa_settings_editor.description.short_name')}</p>
        <input
          name='inputShortName'
          placeholder={t('project_settings_page.pwa_settings_editor.placeholder.short_name')}
          value={appShortName}
          onChange={onShortNameChange}
          maxLength={MAX_PWA_APP_SHORT_NAME_LENGTH}
        />
      </Form.Field>
      <ColorPickerField
        title={themeColorTitle}
        disabled={disabled}
        color={themeColor}
        onColorChangeComplete={onThemeColorChange}
      />
      <ColorPickerField
        title={(
          <label htmlFor='splashScreenColor'>
            {t('project_settings_page.pwa_settings_editor.label.splash_screen_bg')}
          </label>
        )}
        disabled={disabled}
        color={backgroundColor}
        onColorChangeComplete={onBackgroundColorChange}
      />
      <IconField disabled={disabled} iconPreview={iconPreview} onIconChange={onIconChange} />
      <SplashScreenField
        disabled={disabled}
        appTitle={appName}
        iconPreview={iconPreview}
        backgroundColor={backgroundColor}
      />
      <div className='form-buttons'>
        <PrimaryButton disabled={disableUpdateButtons()} loading={updating} onClick={onSaveClick}>
          {getSaveButtonText()}
        </PrimaryButton>
        <TertiaryButton
          // eslint-disable-next-line local-rules/ui-component-styling
          className='cancel-button'
          disabled={disableUpdateButtons()}
          onClick={resetForm}
        >{t('button.cancel', {ns: 'common'})}
        </TertiaryButton>
      </div>
      <RepublishModal
        open={repblishModalOpen}
        onCancel={() => setRepublishModalOpen(false)}
        onConfirm={savePwaInfo}
      />
    </Form>
  )
}

const RepublishModal = ({open, onCancel, onConfirm}) => {
  const {t} = useTranslation(['app-pages', 'common'])

  return (
    <Modal open={open}>
      <Modal.Header>{t('project_settings_page.edit_basic_info_card.modal.header')}</Modal.Header>
      <Modal.Content>
        <p>{t('project_settings_page.edit_basic_info_card.modal.content')}</p>
      </Modal.Content>
      <Modal.Actions>
        <PrimaryButton onClick={onConfirm}>
          {t('project_settings_page.edit_basic_info_card.button.republish')}
        </PrimaryButton>
        <TertiaryButton onClick={onCancel}>
          {t('button.cancel', {ns: 'common'})}
        </TertiaryButton>
      </Modal.Actions>
    </Modal>
  )
}

const IconField = ({disabled, iconPreview, onIconChange}) => {
  const {t} = useTranslation(['app-pages'])
  const [modalOpen, setModalOpen] = React.useState(false)
  const [file, setFile] = React.useState(null)
  const [error, setError] = React.useState(null)
  const inputFileRef = React.useRef<HTMLInputElement>()
  const onReplaceIconClick = () => {
    setError(null)
    if (inputFileRef.current) {
      inputFileRef.current.click()
    }
  }

  React.useEffect(() => {
    setError(false)
  }, [file, disabled])

  const onFileChange = (event) => {
    setError(null)
    setFile(event.target.files[0])
    setModalOpen(true)
  }
  const onModalClose = () => {
    setModalOpen(false)
  }
  const handleIconChange = (coverImagePreview, cropResult) => {
    onIconChange(coverImagePreview, cropResult)
  }
  const onConfirm = (result) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setModalOpen(false)
      handleIconChange(e.target.result, result)
    }
    reader.readAsDataURL(result.cropped.file)
  }
  const onError = (msg) => {
    setModalOpen(false)
    setError(msg)
  }

  return (
    <Form.Field className='icon-field' disabled={disabled}>
      <label htmlFor='pwaIcon'>{t('project_settings_page.icon_field.label.icon')}</label>
      <p>{t('project_settings_page.icon_field.icon_size')}</p>
      <div className='icon-field-container'>
        <IconPreview src={iconPreview} shape='circle' />
        <IconPreview src={iconPreview} shape='squircle' />
        {!disabled &&
          <>
            <PrimaryButton
              onClick={onReplaceIconClick}
            >{t('project_settings_page.icon_field.button.replace_icon')}
            </PrimaryButton>
            <input
              name='pwaIcon'
              type='file'
              accept={ACCEPTED_FILE_TYPES}
              onChange={onFileChange}
              ref={inputFileRef}
              value=''
            />
            {modalOpen &&
              <ImageCropModal
                file={file}
                headerText={t('project_settings_page.icon_field.image_crop_modal.header')}
                minHeight={MAX_PWA_ICON_HEIGHT}
                minWidth={MAX_PWA_ICON_WIDTH}
                onClose={onModalClose}
                onConfirm={onConfirm}
                onError={onError}
              />
            }
          </>
        }
      </div>
      {error && <p className='icon-error'><Icon name='exclamation circle' /> {error}</p>}
    </Form.Field>
  )
}

const SplashScreenField = ({disabled, backgroundColor, iconPreview, appTitle}) => {
  const {t} = useTranslation(['app-pages'])
  return (
    <Form.Field disabled={disabled}>
      <label htmlFor='SplashScreenPreview'>
        {t('project_settings_page.splash_screen_field.label.preview')}{' '}
        <Icon name='search' />
      </label>
      <div className='splash-screen-container' style={{backgroundColor}}>
        <IconPreview
          src={iconPreview}
          shape='circle'
        />
        <p className='app-title' style={{color: getContrastFontColor(backgroundColor)}}>
          {appTitle}
        </p>
      </div>
      <p>{t('project_settings_page.splash_screen_field.chrome_browser')}</p>
    </Form.Field>
  )
}

const ColorPickerField = ({title, disabled, color, onColorChangeComplete}) => {
  const [editingColor, setEditingColor] = React.useState(false)
  const openColorPicker = () => setEditingColor(true)
  const closeClosePicker = () => setEditingColor(false)

  React.useEffect(() => {
    setEditingColor(false)
  }, [disabled])

  return (
    <Form.Field disabled={disabled}>
      {title}
      <div className='color-editor'>
        <div
          className='color-preview'
          style={{backgroundColor: color}}
          onClick={openColorPicker}
        >
          <img src={colorPickerIcon} />
        </div>
        <p className='color-value' onClick={openColorPicker}>{color}</p>
      </div>
      {editingColor &&
        <ColorPicker
          backgroundColor={color}
          onClose={closeClosePicker}
          onChangeComplete={onColorChangeComplete}
        />
      }
    </Form.Field>
  )
}

const ColorPicker = ({backgroundColor, onClose, onChangeComplete}) => (
  <>
    <div className='color-picker-cover' onClick={onClose} />
    <TwitterPicker
      color={backgroundColor}
      triangle='hide'
      onChangeComplete={onChangeComplete}
      className='color-picker'
    />
  </>
)

export default EditPwaSettingsCard
