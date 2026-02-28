import React, {FC, useState, useRef, useEffect} from 'react'
import {useTranslation} from 'react-i18next'

import {combine} from '../../common/styles'
import {titleCase} from '../../common/strings'
import useStyles from '../tags-input-jss'
import {Tag} from '../../ui/components/tag'
import {StandardFieldContainer} from '../../ui/components/standard-field-container'
import {Icon} from '../../ui/components/icon'

interface ITagsSelectDropdown {
  tags: string[]
  options: string[]
  placeholder?: string
  maxTagCount?: number

  // Callbacks
  onSelectDelete: (i: number) => void
  onSelectAddition: (tag: string) => void
}

const TagsSelectDropdown: FC<ITagsSelectDropdown> = ({
  tags = [],
  options = [],
  placeholder,
  maxTagCount,
  onSelectDelete,
  onSelectAddition,
}) => {
  const {t} = useTranslation(['app-pages'])
  const classes = useStyles()
  const dropdownRef = useRef(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [processTag, setProcessTag] = useState('')
  const expectedBlur = React.useRef(false)
  const rawOptions = options.map(option => option.toLowerCase())
  const dropdownTags = tags.reduce((tagList, tag) => {
    const index = rawOptions.indexOf(tag)
    return index > -1 ? [...tagList, options[index]] : tagList
  }, [])
  const predeterminedPlaceholder =
    t('feature_project_page.tags_select_dropdown.placeholder.default.industry')

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const chooseOption = (option: string) => {
    setProcessTag(option.toLowerCase())
  }

  const onTagButtonClick = (tagValue) => {
    const deletedIndex = tags.findIndex(tag => tag.toLowerCase() === tagValue.toLowerCase())
    if (deletedIndex >= 0) {
      onSelectDelete(deletedIndex)
    }
  }

  useEffect(() => {
    if (dropdownOpen) {
      toggleDropdown()
      if (dropdownTags.length < maxTagCount && processTag.length > 0) {
        onSelectAddition(processTag)
        setProcessTag('')
      }
    }
  }, [processTag, tags])

  // This fixes an expected blur on the field when a menu item is clicked.
  const handlePreOptionClick = () => {
    expectedBlur.current = true
  }

  const handleTargetBlur = () => {
    if (expectedBlur.current) {
      expectedBlur.current = false
    } else {
      setDropdownOpen(false)
    }
  }

  return (
    <StandardFieldContainer>
      <div className={classes.tagsInputContainer} onBlur={handleTargetBlur}>
        {dropdownTags.map(tag => (
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
        <div
          role='listbox'
          className={classes.clickableArea}
          onClick={toggleDropdown}
          onKeyDown={toggleDropdown}
          tabIndex={0}
        >
          {dropdownTags.length < 1 &&
            <div className={classes.dropdownPlaceholder}>
              {placeholder || predeterminedPlaceholder}
            </div>
          }
          <div className={classes.dropdownIcon}>
            <Icon inline stroke='chevronDown' size={0.8} />
          </div>
        </div>
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        ref={dropdownRef}
        className={combine(classes.dropdownContent, dropdownOpen && classes.show)}
        onMouseDown={handlePreOptionClick}
      >
        {options.filter(option => !tags.includes(option.toLowerCase()))
          .sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}))
          .map(option => (
            <div
              role='option'
              aria-selected='false'
              key={option}
              className={dropdownTags.length < maxTagCount
                ? classes.dropdownOption
                : combine(classes.inactive, classes.dropdownOption)
            }
              onClick={() => chooseOption(option)}
              onKeyDown={() => chooseOption(option)}
              tabIndex={0}
            >
              {titleCase(option)}
            </div>
          ))}
      </div>
    </StandardFieldContainer>
  )
}

export default TagsSelectDropdown
