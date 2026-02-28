import React from 'react'
import {useTranslation} from 'react-i18next'

import {Icon} from '../ui/components/icon'
import {brandHighlight, gray5} from '../static/styles/settings'
import {FALLBACK_LOCALE, getSupportedLocale8wOptions} from '../../shared/i18n/i18n-locales'
import {CoreDropdown} from '../ui/components/core-dropdown'
import {StandardFieldContainer} from '../ui/components/standard-field-container'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: 0,
  },
  visible: {
    gap: '0.5rem',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center',
  },
  divider: {
    borderLeft: `1px solid ${theme.sfcBorderDefault}`,
    height: '22px',
  },
  language: {
    minWidth: '1.5rem',
    textAlign: 'center',
    lineHeight: 'normal',
  },
  target: {
    'height': '38px',
    'userSelect': 'none',
    'display': 'flex',
    'overflow': 'hidden',
    'alignItems': 'center',
    '&:focus': {
      outline: 'none',
    },
    'cursor': 'pointer',
    '&[aria-disabled=true]': {
      cursor: 'default',
      opacity: 0.5,
    },
  },
  menu: {
    userSelect: 'none',
    position: 'absolute',
    right: 0,
    maxHeight: '20rem',
    overflow: 'auto',
    backgroundColor: theme.sfcBackgroundDefault,
    backdropFilter: theme.sfcBackdropFilter,
    border: `1px solid ${theme.sfcBorderDefault}`,
    boxShadow: `0px 0px 6px ${gray5}20`,
    zIndex: '10',
    borderRadius: '4px',
    display: 'none',
  },
  menuTop: {
    bottom: 'calc(100% + 0.5rem)',
  },
  menuBottom: {
    top: 'calc(100% + 0.5rem)',
  },
  menuOpen: {
    display: 'block',
    width: '7.25rem',
  },
  menuOption: {
    'cursor': 'pointer',
    'position': 'relative',
    'overflow': 'hidden',
    'padding': '0.5rem 0.5rem',
    '&:hover': {
      background: theme.listItemHoverBg,
    },
    '&:not(:last-child)': {
      borderBottom: 'none',
    },
    '&[aria-selected=true]:after': {
      content: '""',
      zIndex: 5,
      position: 'absolute',
      right: '0.5rem',
      top: '50%',
      background: brandHighlight,
      width: '12px',
      height: '12px',
      // eslint-disable-next-line max-len
      clipPath: 'path("m 0.445 6.111 a 0.5 0.5 0 0 1 1.1082 -1.1337 l 2.8883 2.6636 l 5.8793 -7.1223 a 0.5 0.5 0 0 1 1.2846 1.0599 l -6.4314 7.8021 q -0.561 0.5884 -1.096 0.1504 z")',
      transform: 'translateY(-50%)',
    },
  },
  focusedOption: {
    background: theme.listItemHoverBg,
  },
}))

interface ILocaleDropdown {
  onChange: (locale: string) => void
}

const LocaleDropdown: React.FC<ILocaleDropdown> = ({onChange}) => {
  const classes = useStyles()
  const {i18n, t} = useTranslation(['common'])

  const id = 'locale-dropdown'
  const labelId = `${id}-labeltext`
  const value = i18n.language

  const createVisibleContent = (locale: string) => (
    <div className={classes.visible}>
      <Icon stroke='globe' color='muted' aria-labelledby={labelId} />
      <div className={classes.language}>
        {locale.split('-')[1]}
      </div>
      <Icon stroke='chevronDown' aria-labelledby={labelId} />
    </div>
  )

  return (
    <label htmlFor={id}>
      <span className={classes.srOnly} id={labelId}>
        {t('locale_selection.dropdown.label')}
      </span>
      <StandardFieldContainer>
        <CoreDropdown
          id={id}
          labelId={labelId}
          value={value}
          options={getSupportedLocale8wOptions()}
          placeholder={createVisibleContent(FALLBACK_LOCALE)}
          onChange={onChange}
          formatVisibleContent={option => createVisibleContent(option.value)}
          targetClassName={classes.target}
          menuClassName={classes.menu}
          menuTopClassName={classes.menuTop}
          menuBottomClassName={classes.menuBottom}
          menuOpenClassName={classes.menuOpen}
          optionClassName={classes.menuOption}
          focusedOptionClassName={classes.focusedOption}
        />
      </StandardFieldContainer>
    </label>
  )
}

export {LocaleDropdown}
