/* eslint-disable quote-props */
import React, {useEffect, useRef, useState} from 'react'
import {Button, Form, Header, Modal, Input, Popup} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {Trans, useTranslation} from 'react-i18next'

import {InlineMessage} from '../../uiWidgets/messages'
import {toTypeName} from './naming'
import OrientationIcon from './orientation-icon'
import {MAXIMUM_ACTIVE_IMAGE_TARGETS, USER_METADATA_LIMIT} from '../../../shared/xrengine-config'
import type {IImageTarget} from '../../common/types/models'
import {
  brandBlack, brandHighlight, eggshell, gray3, gray5, mobileViewOverride,
} from '../../static/styles/settings'
import {validateImageTargetName} from '../../../shared/validate-image-target-name'
import {combine} from '../../common/styles'
import useDebounce from '../../common/use-debounce'
import trashIcon from '../../static/trash.svg'
import MetadataModal from './metadata-modal'
import modal8Styles from '../../uiWidgets/styles/modal'

import CurvedGeometrySliderPane from './curved-geometry-slider-pane'
import CurvedGeometryMeasurementsPane from './curved-geometry-measurements-pane'
import {
  CurvedGeometryUpdate, getTargetCircumferenceBottom, toHundredths,
  DEFAULT_ARC_ANGLE, MIN_ARC_ANGLE, MAX_ARC_ANGLE, DEFAULT_CONINESS, MIN_CONINESS, MAX_CONINESS,
  DEFAULT_TARGET_CIRCUMFERENCE, MIN_CIRCUMFERENCE, MIN_CYLINDER_SIDE_LENGTH,
} from './curved-geometry'
import {Slider8} from '../../ui/components/sliders'
import {BasicQrCode} from '../../widgets/basic-qr-code'
import {useSelector} from '../../hooks'
import useActions from '../../common/use-actions'
import appsActions from '../apps-actions'
import {Icon} from '../../ui/components/icon'

const isConish = type => type === 'CYLINDER' || type === 'CONICAL'

const CylindricalImageTargetGeometryVisualizer = React.lazy(() => import('./cylindrical-image-target-geometry-visualizer'))

const isJson = (s) => {
  if (!s) {
    return false
  }

  try {
    JSON.parse(s)
    return true
  } catch (err) {
    return false
  }
}

interface IImageTargetModalEdit {
  handleClose: any
  imageTarget: IImageTarget
  otherImageNames: string[]
}

enum InputMode {
  BASIC = 'BASIC',
  ADVANCED = 'ADVANCED'
}

const useStyles = createUseStyles({
  modal: {
    '&.ui.modal': {
      display: 'flex !important',
      flexDirection: 'column',
      width: 'auto',
    },
  },
  mainArea: {
    display: 'grid',
    gridTemplateColumns: 'minmax(auto, 50em) min-content',
    [mobileViewOverride]: {
      gridTemplateColumns: 'minmax(40vw, 95vw)',
    },
  },
  editArea: {
    margin: '0 1em',
  },
  editActions: {
    [mobileViewOverride]: {
      gridRow: '2 / 3',
    },
  },
  preview: {
    flex: '0 0 auto',
    margin: '0 1em',
    backgroundColor: eggshell,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    '& canvas:focus': {
      outline: 'none',
    },
    '& img': {
      width: '100%',
    },
  },
  visualizer: {
    width: '55vh',
    [mobileViewOverride]: {
      maxWidth: '60vh',
      width: '95vw',
    },
  },
  curvedVisualizer: {
    aspectRatio: '3 / 4',
    width: '100%',
    position: 'relative',
    borderRadius: '1em',
    overflow: 'hidden',
    '& canvas': {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  },
  previewActions: {
    [mobileViewOverride]: {
      gridRow: '4 / 5',
    },
  },
  actionBar: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'row',
    margin: '1em',
    alignItems: 'center',
    '&.mini': {
      margin: '0.5em 2em 0.5em 1em',
      [mobileViewOverride]: {
        flexDirection: 'row',
      },
    },
    '& .left': {
      flex: '1 1 0',
      display: 'flex',
      alignItems: 'center',
    },
    '& .right': {
      flex: '1 1 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      '& .deemphasized-button': {
        marginRight: '2em',
      },
    },
    '& .moreSpace': {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& .auto-load-row': {
        display: 'flex',
        alignItems: 'center',
        fontWeight: 700,
        textColor: brandBlack,
      },
    },
  },
  header: {
    margin: '0.5em 1em',
  },
  previewItQrSection: {
    display: 'flex',
  },
  instructions: {
    flex: '1 0 0',
  },
  qrCode: {
    flex: '0 0 auto',
    marginRight: '1em',
    textAlign: 'center',
  },
  qrCodeImg: {
    width: '14em',
  },
  orientationIcon: {
    height: '2em',
  },
  saveButton: {
    backgroundColor: `${brandHighlight} !important`,
  },
  orientationAndDimensions: {
    display: 'flex',
    alignItems: 'center',
    [mobileViewOverride]: {
      display: 'none',
    },
  },
  centered: {
    '& img': {
      objectFit: 'scale-down',
      margin: 'auto',
      borderRadius: '1em',
    },
  },
  maxAutoLoadMessage: {
    paddingTop: '.5em',
    paddingLeft: '2em',
    alignSelf: 'stretch',
    height: '1em',
    minHeight: '1em',
  },
  previewArea: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '50vh',
    [mobileViewOverride]: {
      minHeight: 0,
    },
  },
  button: {
    background: 'none',
    outline: 'none',
    border: '1px solid transparent',
    marginRight: '1em',
    '&:hover': {
      border: `1px solid ${gray5}`,
      cursor: 'pointer',
    },
    userDrag: 'none',
  },
  unit: {
    '&.ui.button': {
      opacity: '1 !important',
      color: '#fff !important',
      backgroundColor: `${gray3} !important`,
    },
    '&.ui.button.disabled': {
      opacity: '1 !important',
      backgroundColor: 'rgb(118, 120, 152) !important',
    },
  },
  expandingMessage: {
    flex: '2 2 0',
  },
  measurementFlip: {
    '&.field': {
      paddingRight: '0 !important',
    },
  },
})

const ImageTargetModalEdit: React.FC<IImageTargetModalEdit> = ({
  handleClose, imageTarget, otherImageNames,
}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const modal8 = modal8Styles()
  const classes = useStyles()
  const [isSaving, setIsSaving] = React.useState(false)
  const [showMetadataModal, setShowMetadataModal] = React.useState(false)
  const [nameError, setNameError] = React.useState(null)
  const [isAutoPan, setIsAutoPan] = React.useState(false)
  const [highlightCircumferenceTop, setHighlightCircumferenceTop] = React.useState(false)
  const [highlightTargetArcLength, setHighlightTargetArcLength] = React.useState(false)
  const imageTargetPreview = useSelector(s => s.common.imageTargetPreview)

  const {
    testImageTarget, deleteImageTarget, updateImageTarget, testImageTargetClear,
  } = useActions(appsActions)

  const metadata = JSON.parse(imageTarget.metadata)

  // Things that requires autosave
  const [name, setName] = useState(imageTarget.name)
  const [userMetadata, setUserMetadata] = useState(imageTarget.userMetadata)
  const [userMetadataIsJson, setUserMetadataIsJson] = useState(imageTarget.userMetadataIsJson)
  const [inputMode, setInputMode] = useState<InputMode>(metadata.inputMode || InputMode.BASIC)
  const [arcAngle, setArcAngle] = useState(metadata.arcAngle || DEFAULT_ARC_ANGLE)
  const [coniness, setConiness] = useState(metadata.coniness || DEFAULT_CONINESS)
  const [cylinderCircumferenceTop, setCylinderCircumferenceTop] = useState(metadata.cylinderCircumferenceTop || 150.0)
  const [cylinderCircumferenceBottom, setCylinderCircumferenceBottom] = useState(metadata.cylinderCircumferenceBottom || 150.0)
  const [cylinderSideLength, setCylinderSideLength] = useState(metadata.cylinderSideLength || 100.0)
  const [targetCircumferenceTop, setTargetCircumferenceTop] = useState(metadata.targetCircumferenceTop || DEFAULT_TARGET_CIRCUMFERENCE)
  const [unit, setUnit] = useState(metadata.unit || 'mm')

  // For the autoload slider loading progress.
  const [isSavingAutoload, setIsSavingAutoload] = useState(false)
  const [autoload, setAutoload] = useState(imageTarget.loadAutomatically)
  const [autoloadSaveError, setAutoloadSaveError] = useState('')

  const handleChangeAutoload = (checked) => {
    if ((checked !== imageTarget.loadAutomatically) && !isSavingAutoload) {
      setAutoload(checked)
      setIsSavingAutoload(true)
      updateImageTarget({
        name,  // Name is always required by the backend, for some reason.
        status: checked ? 'ENABLED' : 'DISABLED',
        uuid: imageTarget.uuid,
        AppUuid: imageTarget.AppUuid,
      }).then(() => {
        setAutoloadSaveError('')
      }).catch((err) => {
        if (err.message.includes('Cannot exceed')) {
          setAutoloadSaveError('Max auto loaded targets exceeded')
        } else {
          setAutoloadSaveError('An error occurred while setting autoload')
        }
        setAutoload(!checked)
      }).then(() => {
        setIsSavingAutoload(false)
      })
    }
  }

  const hasJson = isJson(userMetadata)
  const metadataError = userMetadata &&
    userMetadata.length > USER_METADATA_LIMIT &&
    t('image_target_page.edit_image_target.metadata_error', {metadataLimit: USER_METADATA_LIMIT})
  const canSubmit = (!userMetadata || !userMetadataIsJson || hasJson) &&
    !nameError &&
    imageTarget.status !== 'TAKEN_DOWN' &&
    !metadataError
  const hasMetadataJsonError = userMetadata && userMetadataIsJson && !hasJson
  const measurementError = targetCircumferenceTop > cylinderCircumferenceTop
    ? t('image_target_page.edit_image_target.error_invalid_target_circumference')
    : null

  const save = async (isClosing = false) => {
    if (nameError || measurementError || metadataError) {
      return
    }

    // The backend only support updating the following metadata values
    const updatedState = {
      userMetadata,
      userMetadataIsJson,
      cylinderCircumferenceTop: cylinderCircumferenceTop || MIN_CIRCUMFERENCE,
      cylinderCircumferenceBottom: cylinderCircumferenceBottom || MIN_CIRCUMFERENCE,
      cylinderSideLength: cylinderSideLength || MIN_CYLINDER_SIDE_LENGTH,
      targetCircumferenceTop: targetCircumferenceTop || MIN_CIRCUMFERENCE,
      inputMode,
      unit,
      arcAngle,
      coniness,
      // fields that the save need
      uuid: imageTarget.uuid,
      AppUuid: imageTarget.AppUuid,
      name,
    }

    if (Object.keys(updatedState).every(field => updatedState[field] === imageTarget[field])) {
      return
    }

    setIsSaving(true)

    await updateImageTarget(updatedState)
    if (!isClosing) {
      await testImageTarget(imageTarget.AppUuid, imageTarget.uuid)
    }
    setIsSaving(false)
  }

  const saveFuncRef = useRef(null)
  saveFuncRef.current = save

  // When component unmounts, clear the save function ref used by debounce save.
  useEffect(() => () => {
    saveFuncRef.current = null
  }, [])

  const debouncedSave = useDebounce(saveFuncRef, 1500)

  const isMounted = useRef(false)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    if (showMetadataModal) {
      return
    }
    debouncedSave()
  }, [
    name, userMetadata, userMetadataIsJson, arcAngle, coniness, cylinderCircumferenceTop, unit,
    cylinderCircumferenceBottom, cylinderSideLength, targetCircumferenceTop, showMetadataModal,
  ])

  const handleChangeMeasurements = (updatedValues: CurvedGeometryUpdate) => {
    const {
      arcAngle: updatedArcAngle = arcAngle,
      coniness: updatedConiness = coniness,
      cylinderCircumferenceTop: updatedCylinderCircumferenceTop = cylinderCircumferenceTop,
      cylinderCircumferenceBottom: updatedCylinderCircumferenceBottom = cylinderCircumferenceBottom,
      cylinderSideLength: updatedCylinderSideLength = cylinderSideLength,
      targetCircumferenceTop: updatedTargetCircumferenceTop = targetCircumferenceTop,
    } = updatedValues

    setArcAngle(updatedArcAngle)
    setConiness(updatedConiness)
    setCylinderCircumferenceTop(updatedCylinderCircumferenceTop)
    setCylinderCircumferenceBottom(updatedCylinderCircumferenceBottom)
    setCylinderSideLength(updatedCylinderSideLength)
    setTargetCircumferenceTop(updatedTargetCircumferenceTop)
  }

  const handleChangeSlider = ({newConiness = coniness, newArcAngle = arcAngle}) => {
    const arcAngleRadians = newArcAngle * Math.PI / 180
    const radius = DEFAULT_TARGET_CIRCUMFERENCE / arcAngleRadians
    const cylinderCircumference = 2 * Math.PI * radius

    const scaledConiness = 2 ** newConiness
    const newCylinderCircumferenceTop = cylinderCircumference * Math.sqrt(scaledConiness)
    const newCylinderCircumferenceBottom = cylinderCircumference / Math.sqrt(scaledConiness)

    const newTargetCircumferenceTop = newCylinderCircumferenceTop * (newArcAngle / 360)

    // Cylinder side length is based on the target circumference.
    // To maintain aspect ratio, we whichever target circumference is larger, top or bottom.
    const maxTargetCircumference = Math.max(newTargetCircumferenceTop,
      getTargetCircumferenceBottom(newTargetCircumferenceTop, newCylinderCircumferenceTop,
        newCylinderCircumferenceBottom))
    const newCylinderSideLength = metadata.isRotated
      ? maxTargetCircumference * (metadata.originalWidth / metadata.originalHeight)
      : maxTargetCircumference * (metadata.originalHeight / metadata.originalWidth)

    handleChangeMeasurements({
      coniness: newConiness,
      arcAngle: newArcAngle,
      cylinderCircumferenceTop: toHundredths(newCylinderCircumferenceTop),
      cylinderCircumferenceBottom: toHundredths(newCylinderCircumferenceBottom),
      cylinderSideLength: toHundredths(newCylinderSideLength),
      targetCircumferenceTop: toHundredths(newTargetCircumferenceTop),
    })
  }

  useEffect(() => {
    testImageTarget(imageTarget.AppUuid, imageTarget.uuid)
  }, [])

  const handleNameChange = (e, target) => {
    const newName = target.value
    setName(newName)
    setNameError(validateImageTargetName(newName, {otherImageNames}))
  }

  const resetDerivedState = () => {
    // Since we move the state location on close, these derived state will get stuck
    // without a reset
    setIsSaving(false)
    setNameError(null)
  }

  const close = () => {
    resetDerivedState()
    handleClose()
  }

  const handleDelete = async () => {
    // eslint-disable-next-line no-alert, local-rules/hardcoded-copy
    const verify = window.confirm('Deleting an image target is permanent.\n\nAre you sure?')

    if (verify) {
      await deleteImageTarget(imageTarget.AppUuid, imageTarget.uuid)
      close()
    }
  }

  // After we have saved the data and called target tester to update its cache, we need to clear
  // test image target from the Redux state when this component unmounts so a new upload will not
  // show a stale asset token
  const saveThenClose = () => save(true).then(testImageTargetClear).then(close)

  const handleChangeInputMode = (e, {value}) => {
    if (value === InputMode.BASIC) {
      handleChangeSlider({
        newArcAngle: Math.min(MAX_ARC_ANGLE, Math.max(
          targetCircumferenceTop / cylinderCircumferenceTop * 360,
          MIN_ARC_ANGLE
        )),
        newConiness: Math.min(MAX_CONINESS, Math.max(
          Math.log2(cylinderCircumferenceTop / cylinderCircumferenceBottom),
          MIN_CONINESS
        )),
      })
    }
    setInputMode(value)
  }

  const apiDocsFadeTrigger = (
    <span className='link-fade'>
      <Icon stroke='questionMark' inline color='gray4' />
      <a
        href='https://docs.8thwall.com/web/#changing-active-image-targets'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Trans
          ns='app-pages'
          i18nKey='image_target_page.edit_image_target.api_docs'
        >
          Image Target API Docs <Icon stroke='external' inline />
        </Trans>
      </a>
    </span>
  )

  return (
    <Modal
      open
      onClose={close}
      size='large'
      className={combine(modal8.modal, classes.modal)}
    >
      <h2 className={classes.header}>
        {t(`image_target_page.edit_image_target.heading.${toTypeName(imageTarget.type)}`)}
      </h2>
      <div className={classes.mainArea}>
        <div className={classes.editArea}>
          <Form>
            <Form.Group>
              <Form.Field width={16}>
                <Input
                  id='name-note'
                  className='name'
                  onChange={handleNameChange}
                  name='name'
                  value={name}
                  fluid
                />
                {nameError &&
                  <InlineMessage error>
                    <Icon stroke='danger' inline />
                    <strong>{nameError}</strong>
                  </InlineMessage>
                }
              </Form.Field>
            </Form.Group>
            {imageTarget.type === 'PLANAR'
              ? (
                <p>{t('image_target_page.edit_image_target.instruction_planar')}</p>
              )
              : (
                <p>{t('image_target_page.edit_image_target.instruction_non_planar')}</p>
              )}
            {isConish(imageTarget.type) &&
              <>
                <Form.Group inline>
                  <label htmlFor='inputMode'>
                    {t('image_target_page.edit_image_target.label.input_mode')}
                  </label>
                  <Form.Radio
                    name='inputMode'
                    value={InputMode.BASIC}
                    label={t('image_target_page.edit_image_target.label.sliders')}
                    checked={inputMode === InputMode.BASIC}
                    onChange={handleChangeInputMode}
                  />
                  <Form.Radio
                    name='inputMode'
                    value={InputMode.ADVANCED}
                    label={t('image_target_page.edit_image_target.label.measurements')}
                    checked={inputMode === InputMode.ADVANCED}
                    onChange={handleChangeInputMode}
                  />
                  <div className={classes.expandingMessage}>{isSaving ? 'saving...' : ' '}</div>
                  <Form.Field className={classes.measurementFlip}>
                    {isConish(imageTarget.type) && inputMode === InputMode.ADVANCED && (
                      <Button.Group float='right' size='mini'>
                        <Button
                          className={classes.unit}
                          size='mini'
                          attached='left'
                          content='in'
                          onClick={() => setUnit('in')}
                          disabled={unit === 'in'}
                        />
                        <Button
                          className={classes.unit}
                          size='mini'
                          attached='right'
                          content='mm'
                          onClick={() => setUnit('mm')}
                          disabled={unit === 'mm'}
                        />
                      </Button.Group>
                    )}
                  </Form.Field>
                </Form.Group>
                {inputMode === InputMode.ADVANCED
                  ? (
                    <CurvedGeometryMeasurementsPane
                      type={imageTarget.type}
                      unit={unit}
                      originalHeight={metadata.originalHeight}
                      originalWidth={metadata.originalWidth}
                      isRotated={metadata.isRotated}
                      cylinderCircumferenceTop={cylinderCircumferenceTop}
                      cylinderCircumferenceBottom={cylinderCircumferenceBottom}
                      cylinderSideLength={cylinderSideLength}
                      targetCircumferenceTop={targetCircumferenceTop}
                      currentCylinderCircumferenceTop={metadata.cylinderCircumferenceTop}
                      currentCylinderCircumferenceBottom={metadata.cylinderCircumferenceBottom}
                      topRadius={metadata.topRadius}
                      bottomRadius={metadata.bottomRadius}
                      onHighlightTopChange={setHighlightCircumferenceTop}
                      onHighlightTargetChange={setHighlightTargetArcLength}
                      onChange={handleChangeMeasurements}
                    />
                  )
                  : (
                    <CurvedGeometrySliderPane
                      type={imageTarget.type}
                      originalHeight={metadata.originalHeight}
                      originalWidth={metadata.originalWidth}
                      isRotated={metadata.isRotated}
                      arcAngle={arcAngle}
                      onChange={handleChangeSlider}
                    />
                  )}
                {measurementError && <InlineMessage error>{measurementError}</InlineMessage>}
              </>
            }
            {imageTargetPreview &&
              <>
                <Header as='h4'>
                  {t('image_target_page.edit_image_target.image_target_preview.heading')}
                </Header>
                <div className={classes.previewItQrSection}>
                  <div className={classes.qrCode}>
                    <BasicQrCode
                      className={classes.qrCodeImg}
                      url={imageTargetPreview}
                      margin={0}
                    />
                    <p>
                      <Trans
                        ns='app-pages'
                        i18nKey='image_target_page.edit_image_target.image_target_preview.link'
                      >
                        {'Scan or '}
                        <a
                          href={imageTargetPreview}
                        >open link <Icon stroke='external' color='gray4' size={1.2} inline />
                        </a>
                      </Trans>
                    </p>
                  </div>
                  <div className={classes.instructions}>
                    <p>
                      <strong>
                        {t('image_target_page.edit_image_target.image_target_preview.scan_qr_code')}
                      </strong><br />
                      {t('image_target_page.edit_image_target.image_target_preview.use_camera')}
                    </p>
                    <p>
                      <strong>
                        {t('image_target_page.edit_image_target.image_target_preview.point_device')}
                      </strong><br />
                      {t('image_target_page.edit_image_target.image_target_preview.use_simulator')}
                    </p>
                    {isConish(imageTarget.type) &&
                      <p>
                        <strong>
                          {t('image_target_page.edit_image_target.image_target_preview.test_label')}
                        </strong><br />
                        {t('image_target_page.edit_image_target.image_target_preview.mesh_overlay')}
                      </p>}
                  </div>
                </div>
              </>
            }
            {showMetadataModal && <MetadataModal
              open
              value={userMetadata || ''}
              onChange={(e, {value}) => setUserMetadata(value)}
              isJson={userMetadataIsJson}
              setUserMetadataIsJson={setUserMetadataIsJson}
              hasMetadataJsonError={hasMetadataJsonError}
              metadataError={metadataError}
              onDone={() => {
                setShowMetadataModal(false)
                save()
              }}
            />}
          </Form>
        </div>

        <div className={classes.previewArea}>
          {isConish(imageTarget.type) && (
            <div className={combine(classes.actionBar, 'mini')}>
              <div className='left'>
                {isAutoPan
                  ? <Button size='mini' basic icon='pause' onClick={() => setIsAutoPan(false)} />
                  : <Button size='mini' basic icon='play' onClick={() => setIsAutoPan(true)} />
                }&nbsp;
                {t('image_target_page.edit_image_target.preview_area.auto_rotate')}
              </div>
              <div className='right'>
                {t('image_target_page.edit_image_target.preview_area.simulator')}
              </div>
            </div>
          )}
          <div className={classes.preview}>
            {imageTarget.imageSrc &&
              <div className={classes.visualizer}>
                {isConish(imageTarget.type)
                  ? (
                    <CylindricalImageTargetGeometryVisualizer
                      className={classes.curvedVisualizer}
                      cylinderCircumferenceTop={cylinderCircumferenceTop || MIN_CIRCUMFERENCE}
                      cylinderCircumferenceBottom={cylinderCircumferenceBottom || MIN_CIRCUMFERENCE}
                      cylinderSideLength={cylinderSideLength || MIN_CYLINDER_SIDE_LENGTH}
                      targetCircumferenceTop={targetCircumferenceTop || MIN_CIRCUMFERENCE}
                      originalImagePath={
                        imageTarget.geometryTextureImageSrc ||
                        imageTarget.originalImageSrc
                      }
                      imagePath={imageTarget.imageSrc}
                      imageLandscape={metadata.isRotated}
                      x={metadata.left}
                      y={metadata.top}
                      width={metadata.width}
                      height={metadata.height}
                      originalWidth={metadata.originalWidth}
                      originalHeight={metadata.originalHeight}
                      isAutoPan={isAutoPan}
                      highlightCircumferenceTop={highlightCircumferenceTop}
                      highlightCircumferenceBottom={false}
                      highlightTargetArcLength={highlightTargetArcLength}
                    />
                  )
                  : (
                    <img alt='planar target' src={imageTarget.imageSrc} />
                  )
                }
              </div>
            }
            {imageTarget.status === 'TAKEN_DOWN' &&
              <InlineMessage error>
                <Icon inline stroke='danger' />
                <strong>
                  <Trans
                    ns='app-pages'
                    i18nKey='image_target_page.edit_image_target.preview_area.taken_down'
                  >
                    This image has been removed in accordance with our
                    <a href='https://www.8thwall.com/terms'>terms</a>
                    and can only be deleted.
                  </Trans>
                </strong>
              </InlineMessage>
            }
          </div>
        </div>

        <div className={classes.editActions}>
          <div className={classes.actionBar}>
            <div className='left'>
              <button className={classes.button} type='button' onClick={handleDelete}>
                <img alt='trash' src={trashIcon} />
              </button>
            </div>
            <div className='moreSpace'>
              <div className='auto-load-row'>
                <Slider8
                  id='target-edit-modal-load-automatically'
                  checked={autoload}
                  onChange={handleChangeAutoload}
                  disabled={isSavingAutoload}
                  loading={isSavingAutoload}
                >
                  {t('image_target_page.edit_image_target.slider.load_automatically')}
                </Slider8>&nbsp;
                <Popup
                  trigger={apiDocsFadeTrigger}
                  position='top left'
                  content={t('image_target_page.edit_image_target.popup.autoload',
                    {maxTargets: MAXIMUM_ACTIVE_IMAGE_TARGETS})}
                />
              </div>
              <InlineMessage className={classes.maxAutoLoadMessage} warning>
                {autoloadSaveError.length > 0 && <strong>{autoloadSaveError}</strong>}
              </InlineMessage>
            </div>
            <div className='right'>
              <Button
                color='grey'
                size='tiny'
                content={t('image_target_page.edit_image_target.button.metadata')}
                onClick={() => setShowMetadataModal(true)}
              />
            </div>
          </div>
        </div>

        <div className={classes.previewActions}>
          <div className={classes.actionBar}>
            <div className='left'>
              <div className={classes.orientationAndDimensions}>
                <OrientationIcon
                  className={classes.orientationIcon}
                  type={imageTarget.type}
                  isLandscape={metadata.isRotated}
                />
                <span>&nbsp;{metadata.width} x {metadata.height}</span>
              </div>
              <div className='right'>
                <span>{t('image_target_page.edit_image_target.changes_autosave')}&nbsp;</span>
                <Button
                  className={classes.saveButton}
                  disabled={!canSubmit || isSaving || isSavingAutoload}
                  primary
                  content={
                    isSaving
                      ? t('image_target_page.edit_image_target.button.saving')
                      : t('button.close', {ns: 'common'})
                  }
                  size='tiny'
                  onClick={saveThenClose}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ImageTargetModalEdit
