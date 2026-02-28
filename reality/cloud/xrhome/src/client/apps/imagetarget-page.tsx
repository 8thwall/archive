import React, {useEffect} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import {Button, Header, Container} from 'semantic-ui-react'
import {join} from 'path'
import {useTranslation, Trans} from 'react-i18next'

import {Loader} from '../ui/components/loader'
import ErrorMessage from '../home/error-message'
import {withAppsLoaded} from '../common/with-state-loaded'

import ImageTargetGallery from './image-targets/image-target-gallery'
import ImageTargetModalEdit from './image-targets/image-target-modal-edit-new'
import ImageTargetUploadContainer from './image-targets/image-target-upload-container'
import {AppPathEnum} from '../common/paths'
import WorkspaceCrumbHeading from '../widgets/workspace-crumb-heading'

import flatIcon from '../static/galleryFlat.svg'
import cylinderIcon from '../static/galleryCylindrical.svg'
import coneIcon from '../static/galleryConical.svg'

import '../static/styles/image-target.scss'

import Page from '../widgets/page'
import ImageTargetApiBox from '../image-targets/image-target-api-box'
import {isPlatformApiVisible} from '../../shared/account-utils'
import imageTargetsActions from '../image-targets/actions'
import {FilterOptions} from '../image-targets/image-target-view-options'
import {useAppPathsContext} from '../common/app-container-context'
import useActions from '../common/use-actions'
import useCurrentApp from '../common/use-current-app'
import {useSelector} from '../hooks'
import useCurrentAccount from '../common/use-current-account'
import {
  IMAGE_TARGET_EDITOR_GALLERY_ID as EDITOR_GALLERY_ID,
} from './image-targets/image-target-constants'
import {Icon} from '../ui/components/icon'
import {downloadAndZipAllImageTargetsForApp, downloadBlob} from '../common/download-utils'
import {Tooltip} from '../ui/components/tooltip'

/* eslint-disable local-rules/hardcoded-copy, max-len */
const README_CONTENT = `### Your Exported Image Targets
This zip contains your project's image targets.
- The image target with the \`_target\` suffix is the image target loaded by the engine. The others are only used for display purposes, but are exported for your convenience.
- To enable image targets, call this in \`app.js\` or \`app.ts\` file. (Note: \`app.js\` or \`app.ts\` may not be created by default; you will need to create this file yourself.) The autoload targets will have a \`"loadAutomatically": true\` property in their json file.
\`\`\`javascript
const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      require('../image-targets/target1.json'),
      require('../image-targets/target2.json'),
    ],
  })
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
\`\`\``
/* eslint-enable local-rules/hardcoded-copy, max-len */

type ProgressState = {
  stage: 'starting' | 'targets'
  current: number
  total: number
}

const ImageTargetPage: React.FC = () => {
  const {t} = useTranslation(['app-pages'])
  const {getPathForApp} = useAppPathsContext()
  const history = useHistory()
  const {
    fetchImageTargetsForApp,
    fetchAllImageTargetsForApp,
    resetGalleryFilterOptionsForApp,
  } = useActions(imageTargetsActions)

  const app = useCurrentApp()
  const account = useCurrentAccount()
  const targetInfo = useSelector(s => s.imageTargets.targetInfoByApp[app.uuid])
  const targetsByUuid = useSelector(s => s.imageTargets.targetsByUuid)
  const gallery = targetInfo?.galleries[EDITOR_GALLERY_ID]
  const imageTargets = gallery?.uuids.map(uuid => targetsByUuid[uuid])
  const hasImageTargets: boolean = app && targetInfo?.targetUuids?.map(
    targetUuid => targetsByUuid[targetUuid]
  )?.length > 0

  const [progressState, setProgressState] = React.useState<ProgressState | null>(null)
  const [errors, setErrors] = React.useState<string[]>([])
  const canStartDownload = progressState === null ||
      (progressState.stage === 'targets' && progressState.current === progressState.total)

  let imageTarget = null
  let pathTargetUuid

  const {routeTarget} = useParams<{routeTarget: string}>()

  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(routeTarget)) {
    pathTargetUuid = routeTarget
    const target = targetsByUuid[routeTarget]
    if (target?.AppUuid === app.uuid) {
      imageTarget = target
    }
  }

  const targetsLoading = gallery?.status?.startsWith('loading')
  const forceLoading = gallery?.status === 'loading-initial'
  const hasMoreTargets = !!gallery?.continuation

  const handleClose = () => {
    history.push(getPathForApp(AppPathEnum.targets))

    if (!imageTargets.find(target => target.uuid === pathTargetUuid)) {
      // The target is not in the gallery, it is probably a new target or target
      // was navigated to directly. Reload the gallery
      fetchImageTargetsForApp(app.uuid, EDITOR_GALLERY_ID)
    }
  }

  useEffect(() => () => {
    resetGalleryFilterOptionsForApp(app.uuid, EDITOR_GALLERY_ID)
  }, [app.uuid])

  useEffect(() => {
    fetchImageTargetsForApp(app.uuid, EDITOR_GALLERY_ID)
  }, [app.uuid])

  useEffect(() => {
    if (pathTargetUuid && !imageTarget) {
      fetchImageTargetsForApp(app.uuid, EDITOR_GALLERY_ID)
    }
  }, [app.uuid, pathTargetUuid, imageTarget, imageTarget?.uuid])

  if (!app) {
    return null
  }
  const imageTargetPath = getPathForApp(AppPathEnum.targets)
  const getTargetEditPath = target => join(imageTargetPath, target.uuid)

  // TODO(pawel) This check no longer works because of pagination. Remove and replace
  // with a similar mechanism as for autoload targets.
  const otherImageNames = imageTargets?.filter(it => it.uuid !== imageTarget?.uuid)
    .map(it => it.name)

  const handleDownloadImageTargets = async () => {
    if (!canStartDownload) {
      return
    }
    const JsZip = (await import('jszip')).default
    const zip = new JsZip()

    setProgressState({stage: 'starting', current: 0, total: 0})
    setErrors([])

    zip.file('README.md', README_CONTENT)

    const newErrors = await downloadAndZipAllImageTargetsForApp(
      zip,
      app.uuid,
      fetchAllImageTargetsForApp,
      t,
      setProgressState
    )
    setErrors(newErrors)

    const zipBlob = await zip.generateAsync({type: 'blob'})
    downloadBlob(zipBlob, `image-targets-${app.uuid}.zip`)
  }

  if (!hasImageTargets && targetsLoading) {
    return (<Loader />)
  }

  return (
    <Page headerVariant='workspace'>
      <WorkspaceCrumbHeading
        app={app}
        account={account}
        text={t('image_target_page.workspace_crumb_heading')}
      />
      <ErrorMessage />
      <Container className='topContainer content' fluid>
        <p>{t('image_target_page.describe_image_target')}</p>
        <p>{t('image_target_page.describe_max_targets')}</p>
        <p>
          <Trans
            ns='app-pages'
            i18nKey='image_target_page.describe_api_cta'
          >
            Dynamically select active image targets at runtime via API.&nbsp;
            <a href='https://docs.8thwall.com/web#image-targets'>
              Learn&nbsp;More&nbsp;in&nbsp;Documentation&nbsp;&rsaquo;
            </a>
          </Trans>
        </p>

        {isPlatformApiVisible(account) &&
          <ImageTargetApiBox appKey={app.appKey} account={account} />
        }

        <Header as='h2'>{t('image_target_page.header.create_new_image_target')}</Header>
        <div className='button-grid three'>
          <Button
            as={Link}
            className='upload-button'
            to={join(imageTargetPath, 'new-flat')}
            a8='click;xrhome-image-target-management;upload-flat-target-button'
          >
            <img alt='flat' src={flatIcon} />
          </Button>
          <Button
            as={Link}
            className='upload-button'
            to={join(imageTargetPath, 'new-cylinder')}
            a8='click;xrhome-image-target-management;upload-cylindrical-target-button'
          >
            <img alt='cylindrical' src={cylinderIcon} />
          </Button>
          <Button
            as={Link}
            className='upload-button'
            to={join(imageTargetPath, 'new-conical')}
            a8='click;xrhome-image-target-management;upload-conical-target-button'
          >
            <img alt='cone' src={coneIcon} />
          </Button>
          <span>{t('image_target_page.label.flat')}</span>
          <span>{t('image_target_page.label.cylindrical')}</span>
          <span>{t('image_target_page.label.conical')}</span>
        </div>

        {(hasImageTargets) &&
          <>
            <FilterOptions appUuid={app.uuid} galleryUuid={EDITOR_GALLERY_ID} />
            <div className='image-targets'>
              <div className='my-image-targets'>
                <Header
                  className='my-image-targets-header'
                  as='h2'
                >
                  {t('image_target_page.header.my_image_targets')}
                </Header>
                {BuildIf.EXPORT_IMAGE_TARGETS_20251217 &&
                  <Button onClick={handleDownloadImageTargets} disabled={!canStartDownload}>
                    <span className='download-button-container'>
                      <Icon inline stroke='download' />
                      {progressState
                        ? t(
                          'image_target_page.header.download_image_targets_progress',
                          {current: progressState.current, total: progressState.total}
                        )
                        : t('image_target_page.header.download_image_targets')}
                      {errors.length > 0 &&
                        <Tooltip
                          content={errors.map(error => <div key={error}>{error}</div>)}
                          position='bottom-start'
                        >
                          <Icon inline stroke='warning' color='warning' />
                        </Tooltip>
                      }
                    </span>
                  </Button>
                }
              </div>
              {imageTargets &&
                <ImageTargetGallery
                  galleryUuid={EDITOR_GALLERY_ID}
                  imageTargets={imageTargets}
                  getTargetEditPath={getTargetEditPath}
                  loadingTargets={targetsLoading}
                  forceLoading={forceLoading}
                  hasMoreTargets={hasMoreTargets}
                />
              }
            </div>
          </>
        }

        {imageTarget &&
          <ImageTargetModalEdit
            imageTarget={imageTarget}
            key={imageTarget.uuid}
            handleClose={handleClose}
            otherImageNames={otherImageNames}
          />
        }

        <ImageTargetUploadContainer />
      </Container>
    </Page>
  )
}

export default withAppsLoaded(ImageTargetPage)
