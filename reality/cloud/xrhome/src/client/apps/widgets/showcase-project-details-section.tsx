import React, {FC, useContext, useState} from 'react'
import {useTranslation} from 'react-i18next'

import {combine} from '../../common/styles'
import Accordion from '../../widgets/accordion'
import useStyles from '../showcase-project-jss'
import TagsInput from './tags-input'
import TagsSelectDropdown from './tags-select-dropdown'
import ErrorMessage from './error-message'
import ColoredMessage from '../../messages/colored-message'
import ShowcaseSettingsContext from '../settings/showcase-settings-context'
import {TECHNOLOGIES} from '../../../shared/discovery-constants'
import {KEYWORDS} from '../../../shared/discovery-constants'
import {
  MAX_APP_TAG_TECH_COUNT, MAX_APP_TAG_INDUSTRY_COUNT,
  MAX_APP_TAG_FREEFORM,
} from '../../../shared/app-constants'
import useCurrentApp from '../../common/use-current-app'
import {isEntryWebApp} from '../../../shared/app-utils'
import {TooltipIcon} from '../../widgets/tooltip-icon'
import {MarkdownTextarea} from '../../modules/widgets/markdown-textarea'
import useCurrentAccount from '../../common/use-current-account'

interface Props {
  active: boolean
  onTitleClick: () => void
}

const ShowcaseProjectDetailsSection: FC<Props> = ({active, onTitleClick}) => {
  const classes = useStyles()
  const account = useCurrentAccount()
  const app = useCurrentApp()
  const isAppEntryWebApp = isEntryWebApp(account, app)
  const {
    featuredTagStrings: tags,
    setFeaturedTagStrings: setTags,
    suggestedTags,
    restrictedTags,
    featuredDescription,
    setFeaturedDescription,
    featuredDescriptionIsLoading,
  } = useContext(ShowcaseSettingsContext)
  const {t} = useTranslation(['app-pages', 'public-featured-pages'])
  const industries = KEYWORDS.map(keyword => (
    t(keyword.nameTranslationKey, {ns: 'public-featured-pages'})))
  const techTypes = TECHNOLOGIES.map(keyword => keyword.displayName || keyword.name)
  const filterList = industries.concat(techTypes)
  const [error, setError] = useState('')
  const [notif, setNotif] = useState('')
  const isMaxIndustryTags = tags
    .filter(option => industries.includes(option) || industries.includes(option.toUpperCase()))
    .length >= MAX_APP_TAG_INDUSTRY_COUNT
  const isMaxTechTags = tags
    .filter(option => techTypes.includes(option)).length >= MAX_APP_TAG_TECH_COUNT
  const TAGS_QUESTION_POPUP_CONTENT = t('feature_project_page.showcase_project_details.popup.tags',
    {maxTags: MAX_APP_TAG_FREEFORM})

  const onDelete = (i) => {
    const newTags = tags.slice(0)
    newTags.splice(i, 1)
    setTags(newTags)
  }

  const onPredeterminedAddition = (tag) => {
    const oldTags = tags.slice(0)

    const newTags = [].concat(oldTags, tag)
    setTags(newTags)
  }

  const onAddition = (tag) => {
    const oldTags = tags.slice(0)

    // Do not enter into tag list if existing duplicate tag
    const foundIndex = tags.findIndex(foundTag => foundTag === tag)
    if (foundIndex >= 0) {
      setNotif(
        t('feature_project_page.showcase_project_details.notif.already_entered_tag', {tag})
      )
      return
    }

    // Do not enter into predetermined tag if hit maximum tech/industry tag limits
    if (industries.map(keyword => keyword.toLowerCase()).includes(tag) &&
      isMaxIndustryTags) {
      setNotif(t('feature_project_page.showcase_project_details.notif.max_tags_industry', {tag}))
      return
    }
    if (TECHNOLOGIES.map(keyword => keyword.name).includes(tag) && isMaxTechTags) {
      setNotif(t('feature_project_page.showcase_project_details.notif.max_tags_techtype', {tag}))
      return
    }

    const newTags = [].concat(oldTags, tag)
    setNotif('')
    setTags(newTags)
  }

  return (
    <Accordion>
      <Accordion.Title active={active} onClick={onTitleClick}>
        {t('feature_project_page.showcase_project_details.title')}
      </Accordion.Title>
      <Accordion.Content>
        <div className={classes.subSection}>
          <MarkdownTextarea
            id='showcase-description-editor'
            value={featuredDescription}
            label={(
              <span className={classes.miniHeader}>
                {t('feature_project_page.showcase_project_details.label.overview')}
                {!isAppEntryWebApp && <span className={classes.requiredField}>*</span>}
              </span>
            )}
            setValue={setFeaturedDescription}
            height='medium'
            loading={featuredDescriptionIsLoading}
            splitPreview
          />
        </div>
        {!isAppEntryWebApp &&
          <div className={combine(classes.subSection, classes.split)}>
            <div className={classes.splitCell}>
              <h3 className={classes.miniHeader}>
                {t('feature_project_page.showcase_project_details.label.industry')}{' '}
                <span className={classes.requiredField}>*</span>
              </h3>
              <TagsSelectDropdown
                tags={tags}
                options={industries}
                maxTagCount={MAX_APP_TAG_INDUSTRY_COUNT}
                onSelectDelete={onDelete}
                onSelectAddition={onPredeterminedAddition}
              />
            </div>
            <div className={classes.splitCell}>
              <h3 className={classes.miniHeader}>
                {t('feature_project_page.showcase_project_details.label.techtype')}{' '}
                <span className={classes.requiredField}>*</span>
              </h3>
              <TagsSelectDropdown
                tags={tags}
                options={techTypes}
                maxTagCount={MAX_APP_TAG_TECH_COUNT}
                onSelectDelete={onDelete}
                onSelectAddition={onPredeterminedAddition}
              />
            </div>
          </div>
        }
        <div className={classes.subSection}>
          <h3 className={classes.miniHeader}>
            {t('feature_project_page.showcase_project_details.label.tags')}
            <TooltipIcon
              content={TAGS_QUESTION_POPUP_CONTENT}
              position='top center'
            />
          </h3>
          {/* TODO(wayne): Pass in suggested and restricted tags */}
          <TagsInput
            className={classes.tagsInput}
            tags={tags}
            suggestions={suggestedTags}
            restrictedTags={restrictedTags}
            onDelete={onDelete}
            onAddition={onAddition}
            delimiters={['Enter', 'Tab', ',']}
            filterList={filterList}
            setError={setError}
          />
        </div>
        {error &&
          <div className={classes.topDistance}>
            <ErrorMessage icon='exclamation'><p>{error}</p></ErrorMessage>
          </div>
        }
        {notif &&
          <ColoredMessage
            color='blue'
            iconName='info circle'
          >
            {notif}
          </ColoredMessage>
        }
      </Accordion.Content>
    </Accordion>
  )
}

export default ShowcaseProjectDetailsSection
