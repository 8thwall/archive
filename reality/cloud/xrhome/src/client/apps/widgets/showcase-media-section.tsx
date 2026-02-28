import React, {FC, useState, useContext} from 'react'
import {Input} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import Accordion from '../../widgets/accordion'
import useStyles from '../showcase-project-jss'
import useActions from '../../common/use-actions'
import {combine} from '../../common/styles'
import actions from '../apps-actions'
import type {IAccount, IApp, IFeaturedAppImage} from '../../common/types/models'
import ShowcaseSettingsContext from '../settings/showcase-settings-context'
import {isEntryWebApp} from '../../../shared/app-utils'
import type {CropArea} from '../../common/image-cropper'
import {isValidVideoUrl} from '../../../shared/featured-video'
import {SpaceBetween} from '../../ui/layout/space-between'
import FeaturedImageUploadField from '../../widgets/featured-image-upload-field'
import {FEATURED_APP_IMAGE_DIMENSIONS, getFeaturedAppImageUrl} from '../../../shared/featured-app-image'

interface Props {
  account: IAccount
  app: IApp
  active: boolean
  onTitleClick: () => void
}

const ShowcaseMediaSection: FC<Props> = ({account, app, active, onTitleClick}) => {
  const {t} = useTranslation(['app-pages'])
  const classes = useStyles()
  const [videoUrlError, setVideoUrlError] = useState(false)
  const {uploadFeaturedImage} = useActions(actions)
  const {
    featuredVideoUrl,
    setFeaturedVideoUrl,
    featuredAppImages,
    setFeaturedAppImages,
    featuredAppImageIsUploading,
    setFeaturedAppImageIsUploading,
    setDeletedFeaturedAppImages,
    deletedFeaturedAppImages,
  } = useContext(ShowcaseSettingsContext)

  const [uploadImageError, setUploadImageError] = React.useState(null)

  const isAppEntryWebApp = isEntryWebApp(account, app)
  const onVideoUrlInputChange = (e) => {
    setVideoUrlError(false)
    setFeaturedVideoUrl(e.target.value)
  }

  const onVideoUrlBlurred = (e) => {
    if (e.target.value && !isValidVideoUrl(e.target.value)) {
      setVideoUrlError(true)
    }
  }

  const uploadImage = async (
    uuid: string,
    file: File,
    cropAreaPixels?: CropArea
  ) => {
    setUploadImageError(null)
    setFeaturedAppImageIsUploading(true)
    try {
      const {featuredAppImage} = await uploadFeaturedImage(uuid, file, cropAreaPixels)
      setFeaturedAppImages([...featuredAppImages, featuredAppImage])
    } catch (e) {
      setUploadImageError(
        <p>{t('feature_project_page.showcase_media.error.unable_to_save_media')}</p>
      )
    } finally {
      setFeaturedAppImageIsUploading(false)
    }
  }

  const onDelete = (featuredImage: IFeaturedAppImage) => {
    if (featuredImage.status === 'FEATURED') {
      setDeletedFeaturedAppImages([
        ...deletedFeaturedAppImages,
        {
          ...featuredImage,
          status: 'DELETED',
        },
      ])
    }
    setFeaturedAppImages(featuredAppImages.filter(image => featuredImage.uuid !== image.uuid))
  }

  const getFeaturedImageUrl = (objectId: string) => (
    getFeaturedAppImageUrl(objectId, {dimensions: FEATURED_APP_IMAGE_DIMENSIONS.SMALL})
  )

  return (
    <Accordion>
      <Accordion.Title active={active} onClick={onTitleClick}>
        {t('feature_project_page.showcase_media.title')}
      </Accordion.Title>
      <Accordion.Content>
        <div className={classes.videoUrlInputContainer}>
          <h3 className={classes.miniHeader}>
            {t('feature_project_page.showcase_media.heading.video_link')}
          </h3>
          <p>{t('feature_project_page.showcase_media.blurb.video_link')}</p>
          <Input
            className={videoUrlError
              ? combine(classes.videoUrlInput, classes.errorBorder)
              : classes.videoUrlInput
          }
            placeholder='https://youtu.be/videoID'
            value={featuredVideoUrl}
            onChange={onVideoUrlInputChange}
            onBlur={onVideoUrlBlurred}
          />
          {videoUrlError &&
            <p className={classes.errorCode}>
              {t('feature_project_page.showcase_media.error.invalid_video_url')}
            </p>
          }
        </div>
        <FeaturedImageUploadField
          id='featured-image-upload'
          label={(
            <SpaceBetween direction='vertical' narrow>
              <div className={classes.miniHeader}>
                {t('feature_project_page.showcase_media.heading.image_gallery')}
                {!isAppEntryWebApp && <span className={classes.requiredField}> *</span>}
              </div>
              <p>
                {t('feature_project_page.showcase_media.blurb.image_gallery')}
              </p>
            </SpaceBetween>
          )}
          uploadImage={(file: File, cropAreaPixels?: CropArea) => {
            uploadImage(app.uuid, file, cropAreaPixels)
          }}
          featuredImages={featuredAppImages}
          onDelete={(featuredImage: IFeaturedAppImage) => { onDelete(featuredImage) }}
          uploadImageError={uploadImageError}
          loading={featuredAppImageIsUploading}
          makeImageUrl={(objectId: string) => getFeaturedImageUrl(objectId)}
        />
      </Accordion.Content>
    </Accordion>
  )
}

export default ShowcaseMediaSection
