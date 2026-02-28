import React from 'react'

import {Trans, useTranslation} from 'react-i18next'

import type {IFeaturedAppImage, IAccount, IModule} from '../../common/types/models'
import Accordion from '../../widgets/accordion'
import CollapsibleSettingsGroup from '../../settings/collapsible-settings-group'
import {useCollapsibleSettingsGroup} from '../../settings/use-collapsible-settings-group'
import {ModuleSetting, moduleSettingGroup} from '../module-settings-types'
import {MarkdownTextarea} from './markdown-textarea'
import {createThemedStyles} from '../../ui/theme'
import {SpaceBetween} from '../../ui/layout/space-between'
import useActions from '../../common/use-actions'
import actions from '../actions'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import {PrimaryButton} from '../../ui/components/primary-button'
import {LinkButton} from '../../ui/components/link-button'
import {combine} from '../../common/styles'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {isValidVideoUrl} from '../../../shared/featured-video'
import TagsInput from '../../apps/widgets/tags-input'
import ErrorMessage from '../../apps/widgets/error-message'
import ColoredMessage from '../../messages/colored-message'
import {TooltipIcon} from '../../widgets/tooltip-icon'
import moduleVersionActions from '../module-version-actions'
import {useSelector} from '../../hooks'
import {compareVersionInfo} from '../../../shared/module/compare-module-target'
import {formatFeaturedTags} from '../../apps/settings/format-featured-tags'
import FeaturedImageUploadField from '../../widgets/featured-image-upload-field'
import type {CropArea} from '../../common/image-cropper'
import {MAX_MODULE_FEATURED_IMAGE_COUNT} from '../../../shared/module/module-constants'
import {
  MODULE_FEATURED_IMAGE_DIMENSIONS, getModuleFeaturedImageUrl,
} from '../../../shared/module-featured-image'
import {StandardToggleField} from '../../ui/components/standard-toggle-field'
import {isModuleRepoVisible} from '../../../shared/module-repo-visibility'
import {isPublishFeaturedEnabled} from '../../../shared/account-utils'
import appsActions from '../../apps/apps-actions'
import LinkOut from '../../uiWidgets/link-out'
import {StaticBanner} from '../../ui/components/banner'
import {licenseIsForkable} from '../../editor/licenses'
import licenseIcon from '../../static/license.svg'
import {StandardCheckboxField} from '../../ui/components/standard-checkbox-field'
import {getPublicPathForModule} from '../../common/paths'
import {StandardLink} from '../../ui/components/standard-link'

const useStyles = createThemedStyles(theme => ({
  label: {
    fontWeight: 700,
  },
  required: {
    '&::after': {
      content: '" *"',
      color: theme.inputRequired,
    },
  },
  licenseIcon: {
    display: 'inline-block',
    width: '1em',
    height: '1em',
  },
}))

interface IPublishSettingsCard {
  module: IModule
  account: IAccount
}

const PublishSettingsCard: React.FC<IPublishSettingsCard> = ({
  module, account,
}) => {
  const {t} = useTranslation(['module-pages'])
  const {
    updateModuleFeatureMetadata,
    loadModuleFeaturedDescription,
    uploadFeaturedImage,
  } = useActions(actions)
  const {getSpecifiedTags} = useActions(appsActions)

  const [fetchingVersions, setFetchingVersions] = React.useState(false)
  const {fetchModuleVersions} = useActions(moduleVersionActions)

  const [restrictedTags, setRestrictedTags] = React.useState<string[]>([])
  const [suggestedTags, setSuggestedTags] = React.useState<string[]>([])
  const [agreeTos, setAgreeTos] = React.useState(module.publicFeatured)

  const {origin} = window.location

  const modulePublicPath = getPublicPathForModule(account, module)
  const modulePublicUrl = `${origin}${modulePublicPath}`

  useAbandonableEffect((abandon) => {
    (async () => {
      const specifiedTags = await abandon(getSpecifiedTags())
      setRestrictedTags(specifiedTags.restrictedTags.concat(specifiedTags.blockedTags)
        .map(tag => tag.name))
      setSuggestedTags(specifiedTags.suggestedTags.map(tag => tag.name))
    })()
  }, [])

  React.useEffect(() => {
    (async () => {
      setFetchingVersions(true)
      try {
        await fetchModuleVersions(module.uuid)
      } finally {
        setFetchingVersions(false)
      }
    })()
  }, [module.uuid])

  const versions = useSelector(
    s => s.modules.versions[module?.uuid]
  )?.patchData.filter(version => !version.deprecated)

  const latestVersion = versions && [...versions].sort(compareVersionInfo)[0]
  const hasVersion = !!latestVersion && !fetchingVersions

  const {
    expandedSettings,
    areAllSettingsExpanded,
    toggleSetting,
    expandAllSettings,
    collapseAllSettings,
  } = useCollapsibleSettingsGroup(
    moduleSettingGroup.PUBLISH_SETTINGS, [ModuleSetting.PUBLISH_MODULE]
  )

  const classes = useStyles()

  const [moduleOverview, setModuleOverView] = React.useState('')
  const [featuredVideoUrl, setFeaturedVideoUrl] = React.useState(module.featuredVideoUrl || '')
  const [moduleTags, setModuleTags] = React.useState(module.Tags?.map(tag => tag.name) || [])
  const [codeVisible, setCodeVisible] = React.useState(isModuleRepoVisible(module))
  const [archived, setArchived] = React.useState(module.archived)
  const [tagError, setTagError] = React.useState('')
  const [tagNotification, setTagNotification] = React.useState('')
  const [isPublishing, setIsPublishing] = React.useState(false)
  const [showPublishedBanner, setShowPublishedBanner] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [didBlurVideoUrl, setDidBlurVideoUrl] = React.useState(false)

  const [featuredImages, setFeaturedImages] = React.useState(
    module.FeaturedImages || []
  )
  const [deletedFeaturedImages, setDeletedFeaturedImages] =
    React.useState<IFeaturedAppImage[]>([])
  const [uploadImageError, setUploadImageError] = React.useState(null)
  const [featuredImageIsUploading, setFeaturedImageIsUploading] = React.useState(null)

  const invalidVideoUrl = featuredVideoUrl.length > 0 && !isValidVideoUrl(featuredVideoUrl)

  useAbandonableEffect(async (abandonable) => {
    if (module?.featuredDescriptionId) {
      setModuleOverView(await abandonable(loadModuleFeaturedDescription(module)))
    }
  }, [module?.featuredDescriptionId])

  const repoVisibility = codeVisible ? 'PUBLIC' as const : 'PRIVATE' as const

  const updatedFields = {
    featuredDescription: moduleOverview,
    featuredTags: formatFeaturedTags(module.Tags, moduleTags),
    featuredVideoUrl,
    repoVisibility,
    featuredImages: featuredImages.concat(deletedFeaturedImages),
    archived,
  }

  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPublishing(true)
    await updateModuleFeatureMetadata(
      module.uuid,
      {...updatedFields, publicFeatured: true}
    )
    setIsPublishing(false)
    setShowPublishedBanner(true)
  }

  const handleSaveDraft: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    await updateModuleFeatureMetadata(
      module.uuid,
      updatedFields
    )
    setIsSaving(false)
  }

  const onTagAddition = (tag: string) => {
    // Do not enter into tag list if existing duplicate tag
    const foundIndex = moduleTags.findIndex(moduleTag => moduleTag === tag)
    if (foundIndex >= 0) {
      setTagNotification(
        t('module_settings_page.publish_settings.tags_input.notif.already_entered_tag', {tag})
      )
      return
    }
    setTagNotification('')
    setModuleTags(moduleTags.concat(tag))
  }

  const onTagDelete = (index: number) => {
    const newModuleTags = moduleTags.slice(0)
    newModuleTags.splice(index, 1)
    setModuleTags(newModuleTags)
  }

  const uploadImage = async (
    uuid: string,
    file: File,
    cropAreaPixels?: CropArea
  ) => {
    setUploadImageError(null)
    setFeaturedImageIsUploading(true)
    try {
      const {featuredModuleImage} = await uploadFeaturedImage(uuid, file, cropAreaPixels)
      setFeaturedImages([...featuredImages, featuredModuleImage])
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      setUploadImageError(
        <p>{t('module_settings_page.publish_settings.image_upload.error.unable_to_save_media')}</p>
      )
    } finally {
      setFeaturedImageIsUploading(false)
    }
  }

  const onDelete = (featuredImage: IFeaturedAppImage) => {
    if (featuredImage.status === 'FEATURED') {
      setDeletedFeaturedImages([
        ...deletedFeaturedImages,
        {
          ...featuredImage,
          status: 'DELETED',
        },
      ])
    }
    setFeaturedImages(featuredImages.filter(image => featuredImage.uuid !== image.uuid))
  }

  const getFeaturedImageUrl = (objectId: string) => (
    getModuleFeaturedImageUrl(
      objectId, {dimensions: MODULE_FEATURED_IMAGE_DIMENSIONS.SMALL}
    )
  )

  const isOpenSource = licenseIsForkable(latestVersion?.license)
  const licenseType = isOpenSource ? latestVersion.license : t('phrases.closed_source')
  const canToggleCodeVisibility = isModuleRepoVisible(module) || isOpenSource

  return (
    <CollapsibleSettingsGroup
      header={t('module_settings_page.publish_settings.collapsible_group.header')}
      showCollapseAll={areAllSettingsExpanded}
      onExpandAllClick={expandAllSettings}
      onCollapseAllClick={collapseAllSettings}
    >
      <Accordion className='edit-basic-info-card'>
        <Accordion.Title
          active={expandedSettings.has(ModuleSetting.PUBLISH_MODULE)}
          onClick={() => toggleSetting(ModuleSetting.PUBLISH_MODULE)}
          a8='click;xrhome-module-settings;publish-settings-accordion'
        >
          {t('module_settings_page.publish_settings.title')}
        </Accordion.Title>
        <Accordion.Content>
          <form onSubmit={handlePublish}>
            <SpaceBetween wide direction='vertical'>
              <p>
                <Trans
                  ns='module-pages'
                  i18nKey='module_settings_page.publish_settings.header_description'
                  components={{
                    linkDocs: <LinkOut url='https://www.8thwall.com/docs/guides/modules/' />,
                  }}
                />
              </p>
              <MarkdownTextarea
                id='module-publish-overview-input'
                splitPreview
                value={moduleOverview}
                label={(
                  <SpaceBetween direction='vertical' narrow>
                    <span className={combine(classes.label, classes.required)}>
                      {t('module_settings_page.publish_settings.overview_text_area.heading')}
                    </span>
                    <p>
                      {t('module_settings_page.publish_settings.overview_text_area.description')}
                    </p>
                  </SpaceBetween>
                )}
                placeholder={t(
                  'module_settings_page.publish_settings.overview_text_area.placeholder'
                )}
                height='medium'
                setValue={setModuleOverView}
                isModuleOverview
              />
              <FeaturedImageUploadField
                id='featured-image-upload'
                label={(
                  <SpaceBetween direction='vertical' narrow>
                    <div className={classes.label}>
                      <span>
                        {t('module_settings_page.publish_settings.image_upload.heading')}
                      </span>
                    </div>
                    <p>
                      {t('module_settings_page.publish_settings.image_upload.description')}
                    </p>
                  </SpaceBetween>
                )}
                uploadImage={(file: File, cropAreaPixels?: CropArea) => {
                  uploadImage(module.uuid, file, cropAreaPixels)
                }}
                featuredImages={featuredImages}
                onDelete={(featuredImage: IFeaturedAppImage) => onDelete(featuredImage)}
                uploadImageError={uploadImageError}
                loading={featuredImageIsUploading}
                maxImageCount={MAX_MODULE_FEATURED_IMAGE_COUNT}
                makeImageUrl={(objectId: string) => getFeaturedImageUrl(objectId)}
              />
              <StandardTextField
                id='module-video-url-field'
                label={(
                  <SpaceBetween direction='vertical' narrow>
                    <div className={classes.label}>
                      {t('module_settings_page.publish_settings.video_link_text_field.heading')}
                    </div>
                    <p>
                      {t('module_settings_page.publish_settings.video_link_text_field.description')}
                    </p>
                  </SpaceBetween>
                )}
                placeholder={t(
                  'module_settings_page.publish_settings.video_link_text_field.placeholder'
                )}
                value={featuredVideoUrl}
                onChange={e => setFeaturedVideoUrl(e.target.value)}
                onFocus={() => setDidBlurVideoUrl(false)}
                onBlur={() => setDidBlurVideoUrl(true)}
                errorMessage={(didBlurVideoUrl && invalidVideoUrl) &&
                  t('module_settings_page.publish_settings.video_link_text_field.invalid_url')
                }
              />
              <div>
                <div className={classes.label}>
                  {t('module_settings_page.publish_settings.tags_input.heading')}
                  <TooltipIcon
                    content={t('module_settings_page.publish_settings.tags_input.tooltip')}
                  />
                </div>
                <TagsInput
                  tags={moduleTags}
                  restrictedTags={restrictedTags}
                  suggestions={suggestedTags}
                  onDelete={onTagDelete}
                  onAddition={onTagAddition}
                  delimiters={['Enter', 'Tab', ',']}
                  setError={setTagError}
                />
              </div>
              {tagError &&
                <ErrorMessage icon='exclamation'><p>{tagError}</p></ErrorMessage>
              }
              {tagNotification &&
                <ColoredMessage
                  color='blue'
                  iconName='info circle'
                >
                  {tagNotification}
                </ColoredMessage>
              }
              {canToggleCodeVisibility &&
                <div>
                  <StandardToggleField
                    id='codeVisible'
                    label={(
                      <SpaceBetween direction='vertical' narrow>
                        <div className={classes.label}>
                          {t('module_settings_page.publish_settings.code_visible.heading')}
                        </div>
                        {t('module_settings_page.publish_settings.code_visible.description')}
                      </SpaceBetween>
                    )}
                    checked={codeVisible}
                    onChange={checked => setCodeVisible(checked)}
                  />
                </div>
              }
              {module.publicFeatured &&
                <div>
                  <StandardToggleField
                    id='archive'
                    label={(
                      <SpaceBetween direction='vertical' narrow>
                        <div className={classes.label}>
                          {t('module_settings_page.publish_settings.archive.heading')}
                          <TooltipIcon
                            content={t('module_settings_page.publish_settings.archive.tooltip')}
                          />
                        </div>
                        {t('module_settings_page.publish_settings.archive.description')}
                      </SpaceBetween>
                    )}
                    checked={archived}
                    onChange={checked => setArchived(checked)}
                  />
                </div>
              }
              <div>
                <SpaceBetween narrow direction='vertical'>
                  <div className={classes.label}>
                    {t('module_settings_page.publish_settings.public_license.heading')}
                  </div>
                  <p>
                    <Trans
                      ns='module-pages'
                      i18nKey='module_settings_page.publish_settings.public_license.description'
                    />
                  </p>
                  <span>
                    <img className={classes.licenseIcon} src={licenseIcon} alt='' />
                    {'  '}
                    {licenseType}
                  </span>
                  {isOpenSource &&
                    <StaticBanner hasMarginTop type='info'>
                      <p>
                        <Trans
                          ns='module-pages'
                          i18nKey='module_settings_page.publish_settings.public_license.banner'
                          values={{licenseType}}
                        />
                      </p>
                    </StaticBanner>
                  }
                </SpaceBetween>
              </div>
              <SpaceBetween direction='vertical' narrow>
                <StandardCheckboxField
                  id='agree_tos'
                  checked={agreeTos}
                  onChange={() => setAgreeTos(!agreeTos)}
                  nowrap
                  label={(
                    <Trans
                      ns='module-pages'
                      i18nKey='module_settings_page.publish_settings.agree.tos'
                      components={{
                        linkTos: <LinkOut url='https://8th.io/tos' />,
                        linkPrivacy: <LinkOut url='https://8th.io/privacy' />,
                        linkGuidelines: <LinkOut url='https://www.8thwall.com/guidelines' />,
                      }}
                    />
                  )}
                />
              </SpaceBetween>
              {!hasVersion &&
                <ErrorMessage icon='info'>
                  <p>{t('module_settings_page.publish_settings.missing_deployment_error')}</p>
                </ErrorMessage>
              }
              {showPublishedBanner &&
                <StaticBanner
                  type='info'
                >
                  <p>
                    <Trans
                      ns='module-pages'
                      i18nKey='module_settings_page.publish_settings.info.module_published'
                      components={{
                        linkTo: (
                          <StandardLink
                            newTab
                            href={modulePublicPath}
                          />
                        ),
                      }}
                      values={{modulePublicUrl}}
                    />
                  </p>
                </StaticBanner>
              }
              {!account.publicFeatured &&
                <ErrorMessage icon='exclamation'>
                  <p>{t('module_settings_page.publish_settings.account_not_public_error')}</p>
                </ErrorMessage>
              }
              <SpaceBetween>
                <PrimaryButton
                  type='submit'
                  loading={isPublishing}
                  disabled={
                    isSaving || !moduleOverview || !hasVersion ||
                    invalidVideoUrl || !isPublishFeaturedEnabled(account) ||
                    !agreeTos || !account.publicFeatured
                  }
                >
                  {t('module_settings_page.publish_settings.button.publish')}
                </PrimaryButton>
                {!module.publicFeatured &&
                  <LinkButton
                    type='button'
                    onClick={handleSaveDraft}
                    disabled={isPublishing || isSaving}
                  >
                    {t('module_settings_page.publish_settings.button.save_draft')}
                  </LinkButton>
                }
              </SpaceBetween>
            </SpaceBetween>
          </form>
        </Accordion.Content>
      </Accordion>
    </CollapsibleSettingsGroup>
  )
}

export default PublishSettingsCard
