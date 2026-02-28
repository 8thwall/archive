import * as React from 'react'
import {useTranslation} from 'gatsby-plugin-react-i18next'
import {useLocation} from '@reach/router'

import {setCookie} from '../common/cookie-utils'
import {
  LOCALE_URL_PARAM_NAME,
  LOCALE_COOKIE_NAME,
  SUPPORTED_LOCALE_OPTIONS,
} from '../i18n/i18n-constants'
import {useUserContext, IUserContext} from '../common/user-context'
import * as classes from './locale-selection.module.scss'
import {combine} from '../styles/classname-utils'

const MOVEMENT_BY_KEY = {
  Home: -Infinity,
  PageUp: -10,
  ArrowUp: -1,
  ArrowDown: 1,
  PageDown: 10,
  End: Infinity,
} as const

type DropdownOption = {
  value: string
  content: React.ReactNode
}

const LocaleSelection = () => {
  const {i18n} = useTranslation('common')
  const {currentUser, userAttributes, updateUserAttributes}: IUserContext = useUserContext()
  const {href, search} = useLocation()
  const query = new URLSearchParams(search)
  const languageParam = query.get(LOCALE_URL_PARAM_NAME)
  const value = i18n.language
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [focusedValue, setFocusedValue] = React.useState(null)
  const options = SUPPORTED_LOCALE_OPTIONS.map((supportedLocaleOption) => ({
    value: supportedLocaleOption.value, content: supportedLocaleOption.name,
  }))

  const selectedIndex = options.findIndex((e) => e.value === value)

  const visibleContents = options[selectedIndex].content

  const expectedBlur = React.useRef(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  const onLocaleChange = async (o: DropdownOption) => {
    const lng = o.value
    const url = new URL(href)

    // Set URL param "lang" as needed
    if (languageParam && lng !== languageParam) {
      url.searchParams.set(LOCALE_URL_PARAM_NAME, lng)
    }

    // Set user "locale" as needed
    if (currentUser && lng !== userAttributes?.locale) {
      await updateUserAttributes({locale: lng})
    }

    setCookie(LOCALE_COOKIE_NAME, lng)

    window.location.href = url.href
  }

  // This fixes an expected blur on the field when a menu item is clicked.
  const handlePreOptionClick = () => {
    expectedBlur.current = true
  }

  const doInitialOpen = () => {
    setFocusedValue(value)
    setMenuOpen(true)
  }

  const collapse = () => {
    setFocusedValue(null)
    setMenuOpen(false)
  }

  const handleOptionClick = (o: DropdownOption) => {
    setMenuOpen(false)
    setFocusedValue(null)
    onLocaleChange(o)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const {key} = e
    if (!menuOpen && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
      e.preventDefault()
      doInitialOpen()
      return
    }

    if (menuOpen && MOVEMENT_BY_KEY[key]) {
      e.preventDefault()
      setMenuOpen(true)
      return
    }

    if (menuOpen && key === 'Escape') {
      collapse()
      return
    }

    if (menuOpen && (key === 'Enter' || key === ' ')) {
      e.preventDefault()
      collapse()
    }
  }

  const handleTargetClick = () => {
    if (menuOpen) {
      collapse()
    } else {
      doInitialOpen()
    }
  }

  const handleTargetBlur = () => {
    if (expectedBlur.current) {
      expectedBlur.current = false
    } else {
      collapse()
    }
  }

  return (
    <div className={classes.container}>
      <div
        id='locale-selection'
        className={classes.target}
        role='combobox'
        aria-controls='locale-selection-listbox'
        aria-expanded={menuOpen}
        aria-haspopup='listbox'
        aria-labelledby='locale-selection-labeltext'
        tabIndex={0}
        aria-activedescendant={`local-selection-${value}`}
        onBlur={handleTargetBlur}
        onKeyDown={handleKeyDown}
        onClick={handleTargetClick}
      >
        {visibleContents}
        <span
          className={combine(classes.chevron, menuOpen && classes.chevronOpen)}
          aria-hidden
        />
      </div>
      <div
        ref={menuRef}
        role='listbox'
        className={combine(classes.menu, menuOpen && classes.menuOpen)}
        id='locale-selection-listbox'
        aria-labelledby='locale-selection-listbox'
        tabIndex={-1}
        onMouseDown={handlePreOptionClick}
      >
        {/* NOTE(christoph): Disabling these rules here because the keyboard/focus interactivity
                  is managed on the combobox as opposed to individual option elements. */}
        {/* eslint-disable jsx-a11y/click-events-have-key-events  */}
        {/* eslint-disable jsx-a11y/interactive-supports-focus */}
        {options.map((o) => (
          <div
            key={o.value}
            role='option'
            id={`locale-selection-${o.value}`}
            className={combine(
              classes.menuOption,
              focusedValue === o.value && classes.focusedOption
            )}
            aria-selected={value === o.value}
            onClick={(e) => {
              e.stopPropagation()
              handleOptionClick(o)
            }}
          >
            {o.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LocaleSelection
