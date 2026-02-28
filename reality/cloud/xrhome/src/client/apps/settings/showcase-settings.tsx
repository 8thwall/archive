import React, {useState, useRef, FC, useContext} from 'react'
import {Popup} from 'semantic-ui-react'
import isEqual from 'lodash/isEqual'
import {useTranslation} from 'react-i18next'

import CollapsibleSettingsGroup from '../../settings/collapsible-settings-group'
import {ShowcaseSetting, ShowcaseSettingsGroup} from './showcase-settings-types'
import {useCollapsibleSettingsGroup} from '../../settings/use-collapsible-settings-group'
import ShowcaseBasicInfo from '../widgets/showcase-basic-info-section'
import type {IAccount, IApp} from '../../common/types/models'
import useActions from '../../common/use-actions'
import ShowcaseProjectDetailsSection from '../widgets/showcase-project-details-section'
import ShowcaseSettingsSection from '../widgets/showcase-settings-section'
import ShowcaseMediaSection from '../widgets/showcase-media-section'
import appsActions from '../apps-actions'
import {isBasicInfoCompleted, isEntryWebApp} from '../../../shared/app-utils'
import {brandBlack, brandWhite, brandPurple, tinyViewOverride} from '../../static/styles/settings'
import {AlmostThereModal, PublishOrUpdateModal} from '../widgets/showcase-modals'
import UnpublishProjectCTA from '../widgets/unpublish-project-cta'
import ErrorMessage from '../widgets/error-message'
import ShowcaseSettingsContext from './showcase-settings-context'
import {TECHNOLOGIES} from '../../../shared/discovery-constants'
import {KEYWORDS} from '../../../shared/discovery-constants'
import {formatFeaturedTags} from './format-featured-tags'
import {createCustomUseStyles} from '../../common/create-custom-use-styles'
import {Loader} from '../../ui/components/loader'
import {PrimaryButton} from '../../ui/components/primary-button'
import {TertiaryButton} from '../../ui/components/tertiary-button'
import {Icon} from '../../ui/components/icon'

const useStyles = createCustomUseStyles<{right: number}>()({
  container: {
    'marginBottom': '6rem',
    '& .group-header': {
      marginTop: '0 !important',
    },
  },
  bottomBar: {
    backgroundColor: brandWhite,
    position: 'fixed',
    right: '0',
    height: '5rem',
    left: '0',
    bottom: '0',
    zIndex: '10',
    boxShadow: `0 -0.5rem 0.5rem ${brandBlack}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    marginRight: props => `calc(100vw - ${props.right}px)`,
    whiteSpace: 'nowrap',
  },
  saveButton: {
    marginRight: '1em !important',
    backgroundColor: 'transparent !important',
    color: `${brandPurple} !important`,
    [tinyViewOverride]: {
      marginRight: '0.5em !important',
    },
  },
  savedText: {
    marginRight: '2.5em',
    color: brandPurple,
  },
  publishButtonContainer: {
    display: 'inline-block',
  },
  missingRequiredFields: {
    '& span': {
      color: brandPurple,
    },
    '& ol': {
      color: brandPurple,
      paddingInlineStart: '1em',
      margin: 0,
    },
  },
  loader: {
    left: '-0.5em !important',
  },
})

interface Props {
  account: IAccount
  app: IApp
  onUnpublish: () => void
  onPublishComplete: () => void  // Callback for when publish complete.
}

const ShowcaseSettings: FC<Props> = ({account, app, onUnpublish, onPublishComplete}) => {
  const {t} = useTranslation('app-pages')
  const {
    expandedSettings,
    areAllSettingsExpanded,
    toggleSetting,
    expandAllSettings,
    collapseAllSettings,
  } = useCollapsibleSettingsGroup(
    ShowcaseSettingsGroup.SHOWCASE_SETTINGS,
    Array.from(ShowcaseSettingsGroup.SHOWCASE_SETTINGS)  // All settings expanded by default.
  )
  const {
    getSpecifiedTags, updateAppFeatureMetadata, loadFeaturedAppDescription, publishFeaturedApp,
  } = useActions(appsActions)
  const divRef = useRef(null)
  const classes = useStyles({right: divRef.current?.getBoundingClientRect()?.right || '0'})

  const [loading, setLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isAlmostThereModalOpen, setIsAlmostThereModalOpen] = useState(false)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)

  const {
    featuredDescription,
    setFeaturedDescription,
    featuredTagStrings,
    featuredVideoUrl,
    featuredAppImages,
    isTryable,
    isCloneable,
    publishedFormState,
    setPublishedFormState,
    featuredAppImageIsUploading,
    featuredDescriptionIsLoading,
    setFeaturedDescriptionIsLoading,
    deletedFeaturedAppImages,
    setRestrictedTags,
    setSuggestedTags,
    errorMessage,
    setErrorMessage,
  } = useContext(ShowcaseSettingsContext)

  const techTags = featuredTagStrings.filter(tag => TECHNOLOGIES
    .map(keyword => keyword.name).includes(tag))
  const industryTags = featuredTagStrings.filter(tag => KEYWORDS
    .map(keyword => keyword.name).includes(tag))

  const isAppEntryWebApp = isEntryWebApp(account, app)

  const isBasicInfoComplete = isBasicInfoCompleted(app)
  const isProjectDetailsComplete = [
    featuredDescription, techTags.length, industryTags.length,
  ].every(Boolean)

  const isPublishableChecks = [
    isBasicInfoComplete,
  ]
  if (!isAppEntryWebApp) {
    isPublishableChecks.push(isProjectDetailsComplete)
    isPublishableChecks.push(!!featuredAppImages.length)
  }
  const isPublishable = isPublishableChecks.every(Boolean)

  const requiredFields: {name: string, isComplete: boolean}[] = [
    {
      name: t('feature_project_page.showcase_settings.required_fields.basic_information'),
      isComplete: isBasicInfoComplete,
    },
  ]
  if (!isAppEntryWebApp) {
    requiredFields.push({
      name: t('feature_project_page.showcase_settings.required_fields.project_details'),
      isComplete: isProjectDetailsComplete,
    })
    requiredFields.push({
      name: t('feature_project_page.showcase_settings.required_fields.media'),
      isComplete: !!featuredAppImages.length,
    })
  }

  const draftFormState = {
    featuredDescription,
    featuredTagStrings,
    featuredVideoUrl,
    featuredAppImages,
    isTryable,
    isCloneable,
  }

  const isUpdatable = publishedFormState && !isEqual(publishedFormState, draftFormState)

  React.useEffect(() => {
    let cancelled = false
    getSpecifiedTags().then(({
      restrictedTags: newRestrictedTags,
      blockedTags: newBlockedTags,
      suggestedTags: newSuggestedTags,
    }) => {
      if (cancelled) {
        return
      }
      setRestrictedTags(newRestrictedTags.concat(newBlockedTags))
      setSuggestedTags(newSuggestedTags)
    })

    return () => {
      cancelled = true
    }
  }, [])

  React.useEffect(() => {
    let cancelled = false
    setFeaturedDescriptionIsLoading(true)
    loadFeaturedAppDescription(app.uuid).then((desc) => {
      if (cancelled) {
        return
      }
      setFeaturedDescriptionIsLoading(false)
      setFeaturedDescription(desc)
      if (app.publicFeatured) {
        setPublishedFormState({...draftFormState, featuredDescription: desc})
      }
    })

    return () => {
      cancelled = true
    }
  }, [app.uuid])

  React.useEffect(() => {
    let canceled = false
    if (isSaved) {
      new Promise(r => setTimeout(r, 2000)).then(() => {
        if (canceled) {
          return
        }
        setIsSaved(false)
      })
    }
    return () => { canceled = true }
  }, [isSaved])

  React.useEffect(() => {
    if (app.publicFeatured) {
      setPublishedFormState(draftFormState)
    }
  }, [
    app.publicFeatured,
    app.featuredDescriptionId,
    app.AppTags,
    app.featuredVideoUrl,
    app.FeaturedAppImages,
    app.featuredPreviewDisabled,
    app.repoStatus,
  ])

  const save = async () => {
    await updateAppFeatureMetadata(app.uuid, {
      featuredDescription,
      featuredTags: formatFeaturedTags(app.AppTags, featuredTagStrings),
      featuredVideoUrl,
      featuredImages: featuredAppImages.concat(deletedFeaturedAppImages),
      featuredPreviewDisabled: !isTryable,
      featuredAppCloneable: isCloneable,
    })
  }

  const publish = async () => {
    await publishFeaturedApp(app.uuid, {
      publicFeatured: true,
      featuredDescription,
      featuredTags: formatFeaturedTags(app.AppTags, featuredTagStrings),
      featuredVideoUrl,
      featuredImages: featuredAppImages.concat(deletedFeaturedAppImages),
      featuredPreviewDisabled: !isTryable,
      featuredAppCloneable: isCloneable,
    })
    onPublishComplete()
  }

  const onSave = async () => {
    try {
      setErrorMessage(null)
      setLoading(true)
      await save()
      setIsSaved(true)
    } catch (e) {
      if (e.status === 409) {
        setErrorMessage(t('feature_project_page.showcase_settings.error.save_conflict'))
      } else {
        setErrorMessage(t('feature_project_page.showcase_settings.error.unable_to_save'))
      }
    } finally {
      setLoading(false)
    }
  }

  const onPublish = () => {
    if (account.publicFeatured) {
      setIsPublishModalOpen(true)
    } else {
      setIsAlmostThereModalOpen(true)
    }
  }

  const onSaveAndUpdate = async () => {
    if (
      isTryable === publishedFormState.isTryable && isCloneable === publishedFormState.isCloneable
    ) {
      await onSave()
    } else {
      onPublish()
    }
  }

  const canSave = !loading &&
    !featuredDescriptionIsLoading &&
    !featuredAppImageIsUploading

  const getButtons = () => {
    // [Save & update] button.
    if (app.publicFeatured) {
      return (
        <Popup
          className={classes.missingRequiredFields}
          position='top center'
          disabled={isPublishable}
          trigger={(
            <div className={classes.publishButtonContainer}>
              <PrimaryButton
                // eslint-disable-next-line local-rules/ui-component-styling
                className='offset-shadow'
                onClick={onSaveAndUpdate}
                disabled={!canSave || !isPublishable || !isUpdatable}
                loading={false}
              >
                {/* eslint-disable-next-line local-rules/ui-component-styling */}
                {loading && <Loader className={classes.loader} inline size='tiny' />}
                {t('feature_project_page.showcase_settings.button.save_update')}
              </PrimaryButton>
            </div>
          )}
        >
          <span>{t('feature_project_page.showcase_settings.popup.missing_required_fields')}</span>
          <ol>
            {requiredFields.map(rf => (!rf.isComplete && <li key={rf.name}>{rf.name}</li>))}
          </ol>
        </Popup>
      )
    }

    const isSavedCopy = (
      <>
        <Icon stroke='checkmark' size={1.3} inline />
        {t('feature_project_page.showcase_settings.saved')}
      </>
    )
    const isSavedButton = isAppEntryWebApp
      ? <PrimaryButton disabled>{isSavedCopy}</PrimaryButton>
      : <span className={classes.savedText}>{isSavedCopy}</span>
    const saveButton = (
      isAppEntryWebApp
        ? (
          <PrimaryButton disabled={!canSave} onClick={onSave}>
            {loading && <Loader inline size='tiny' />}
            {t('feature_project_page.showcase_settings.button.save_update')}
          </PrimaryButton>
        )
        : (
          <TertiaryButton
            // eslint-disable-next-line local-rules/ui-component-styling
            className={classes.saveButton}
            disabled={!canSave}
            onClick={onSave}
          >
            {loading && <Loader inline size='tiny' />}
            {t('feature_project_page.showcase_settings.button.save_draft')}
          </TertiaryButton>
        )
    )

    // [Save draft] and [Publish] buttons.
    return (
      <>
        {isSaved ? isSavedButton : saveButton}
        {!isAppEntryWebApp &&
          <Popup
            className={classes.missingRequiredFields}
            position='top center'
            disabled={isPublishable}
            trigger={(
              <div className={classes.publishButtonContainer}>
                <PrimaryButton
                  // eslint-disable-next-line local-rules/ui-component-styling
                  className='offset-shadow'
                  onClick={onPublish}
                  disabled={!canSave || !isPublishable}
                >{t('feature_project_page.showcase_settings.button.publish')}
                </PrimaryButton>
              </div>
            )}
          >
            <span>{t('feature_project_page.showcase_settings.popup.missing_fields')}</span>
            <ol>
              {requiredFields.map(rf => (!rf.isComplete && <li key={rf.name}>{rf.name}</li>))}
            </ol>
          </Popup>
        }
      </>
    )
  }

  return (
    <>
      <div className={classes.container} ref={divRef}>
        <CollapsibleSettingsGroup
          showCollapseAll={areAllSettingsExpanded}
          onExpandAllClick={expandAllSettings}
          onCollapseAllClick={collapseAllSettings}
        >
          <ShowcaseBasicInfo
            account={account}
            app={app}
            active={expandedSettings.has(ShowcaseSetting.BASIC_INFO)}
            onTitleClick={() => toggleSetting(ShowcaseSetting.BASIC_INFO)}
          />
          <ShowcaseProjectDetailsSection
            active={expandedSettings.has(ShowcaseSetting.PROJECT_DETAILS)}
            onTitleClick={() => toggleSetting(ShowcaseSetting.PROJECT_DETAILS)}
          />
          <ShowcaseMediaSection
            account={account}
            app={app}
            active={expandedSettings.has(ShowcaseSetting.MEDIA)}
            onTitleClick={() => toggleSetting(ShowcaseSetting.MEDIA)}
          />
          <ShowcaseSettingsSection
            active={expandedSettings.has(ShowcaseSetting.TOGGLES)}
            onTitleClick={() => toggleSetting(ShowcaseSetting.TOGGLES)}
          />
          {!isAppEntryWebApp && <UnpublishProjectCTA app={app} onUnpublish={onUnpublish} />}
          <div className={classes.bottomBar}>
            {errorMessage &&
              <ErrorMessage icon='exclamation' inline noBackground>
                {errorMessage}
              </ErrorMessage>
            }
            <div className={classes.buttonContainer}>
              {getButtons()}
            </div>
          </div>
        </CollapsibleSettingsGroup>
      </div>
      {isAlmostThereModalOpen &&
        <AlmostThereModal
          account={account}
          onClose={() => setIsAlmostThereModalOpen(false)}
          save={save}
        />
      }
      {isPublishModalOpen &&
        <PublishOrUpdateModal
          app={app}
          onClose={() => setIsPublishModalOpen(false)}
          publish={publish}
          save={save}
          isTryable={isTryable}
          isCloneable={isCloneable}
          previousIsTryable={publishedFormState.isTryable}
          previousIsCloneable={publishedFormState.isCloneable}
        />
      }
    </>
  )
}

export default ShowcaseSettings
