import React, {FC, useState} from 'react'
import AutosizeInput from 'react-input-autosize'
import {useTranslation} from 'react-i18next'

import {combine} from '../../common/styles'
import {isValidAppTagString} from '../../../shared/app-utils'
import {MAX_APP_TAG_FREEFORM, MAX_APP_TAG_LENGTH} from '../../../shared/app-constants'
import useStyles from '../tags-input-jss'
import {StandardFieldContainer} from '../../ui/components/standard-field-container'
import {Tag} from '../../ui/components/tag'

const DEFAULT_DELIMITERS = ['Enter', 'Tab']
const BACKSPACE_KEYCODE = 'Backspace'

interface ITagsInput {
  className?: string
  tags: string[]
  suggestions?: string[]
  restrictedTags?: string[]
  placeholder?: string
  delimiters?: string[]
  maxTagLength?: number
  maxTagCount?: number
  filterList?: string[]

  // Callbacks
  onDelete: (i: number) => void
  onAddition: (tag: string) => void
  setError: (str: string) => void
}

const TagsInput: FC<ITagsInput> = ({
  className,
  tags = [],
  suggestions = [],
  restrictedTags = [],
  placeholder,
  delimiters = DEFAULT_DELIMITERS,
  maxTagLength = MAX_APP_TAG_LENGTH,
  maxTagCount = MAX_APP_TAG_FREEFORM,
  filterList = [],
  onDelete,
  onAddition,
  setError,
}) => {
  const {t} = useTranslation(['app-pages'])
  const [tagsInputValue, setTagsInputValue] = useState('')
  const tagsInputRef = React.useRef(null)
  const classes = useStyles()
  const freeformTags = tags
    .filter(tag => !filterList.map(filter => filter.toLowerCase()).includes(tag))

  const onTagsInputChange = (e) => {
    if (e.target.value.length <= maxTagLength && freeformTags.length < maxTagCount) {
      setTagsInputValue(e.target.value.toLowerCase())
    }
  }

  const addTag = (untrimmedTagValue) => {
    if (freeformTags.length >= maxTagCount) {
      return
    }

    const tagValue = untrimmedTagValue.trim()
    if (!isValidAppTagString(tagValue)) {
      // TODO(wayne): Refine this error message
      setError(`"${tagValue}" is not a valid tag.`)
      return
    }

    if (restrictedTags.some(rTag => rTag === tagValue)) {
      // TODO(wayne): Refine this error message
      setError(`"${tagValue}" is not allowed.`)
      return
    }

    setError('')
    // Remove extra spaces and hashtags
    onAddition(tagValue.replace(/\s\s+/g, ' ').replace(/#/g, '').trim())
  }

  const onTagsInputKeyDown = (e) => {
    if (e.key === BACKSPACE_KEYCODE && tagsInputValue === '' && freeformTags.length > 0) {
      const lastFreeformIndex = tags.findIndex(tag => tag === freeformTags[freeformTags.length - 1])
      if (lastFreeformIndex >= 0) {
        onDelete(lastFreeformIndex)
      }

      setError('')
      e.preventDefault()
    } else if (!!e.target.value && delimiters.some(d => d === e.key)) {
      addTag(e.target.value)
      setTagsInputValue('')
      e.preventDefault()
    }
  }

  const onFocusLost = (e) => {
    if (e.target.value) {
      addTag(e.target.value)
      setTagsInputValue('')
    }
    e.preventDefault()
  }

  const onTagButtonClick = (tagValue) => {
    const deletedIndex = tags.findIndex(tag => tag === tagValue)
    if (deletedIndex >= 0) {
      onDelete(deletedIndex)
    }
  }

  const onSuggestionButtonClick = (e) => {
    addTag(e.target.value)
  }

  return (
    <div className={className}>
      <StandardFieldContainer>
        <div
          className={combine(classes.tagsInputContainer, classes.tagsTextInput)}
          onFocus={() => tagsInputRef.current.focus()}
          tabIndex={-1}
        >
          {freeformTags.map(tag => (
            <Tag
              height='small'
              key={tag}
              onClick={() => onTagButtonClick(tag)}
              dismissible
              wrap
            >
              {tag}
            </Tag>
          ))}
          {freeformTags.length < maxTagCount &&
            <AutosizeInput
              className={classes.tagsInput}
              type='text'
              ref={tagsInputRef}
              value={tagsInputValue}
              onChange={onTagsInputChange}
              onKeyDown={onTagsInputKeyDown}
              placeholder={!freeformTags.length
                ? placeholder || t('feature_project_page.tags_input.placeholder.default.tags')
                : ''}
              onBlur={onFocusLost}
            />
        }
        </div>
      </StandardFieldContainer>
      <div className={classes.tagSuggestions}>
        {suggestions.length > 0 &&
          <>
            <span>{t('feature_project_page.tags_input.label.suggestions')}</span>
            {suggestions.map(suggestion => (
              <button
                className={classes.suggestionButton}
                key={suggestion}
                value={suggestion}
                type='button'
                onClick={onSuggestionButtonClick}
              >
                {suggestion}
              </button>
            ))}
          </>
        }
      </div>
    </div>
  )
}

export default TagsInput
