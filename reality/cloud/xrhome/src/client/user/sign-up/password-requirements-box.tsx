/* eslint-disable quote-props */
import React from 'react'
import {useTranslation} from 'react-i18next'

import {Icon} from '../../ui/components/icon'
import {createThemedStyles} from '../../ui/theme'
import {tinyViewOverride} from '../../static/styles/settings'

const useStyles = createThemedStyles(theme => ({
  box: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minWidth: '14em',
    borderRadius: '0.5rem',
    margin: '0',
    marginBottom: '1rem',
    padding: '0.5em',
    color: theme.fgMuted,
    background: theme.sfcBackgroundDefault,
    border: `1px solid ${theme.sfcBorderDefault}`,
    backdropFilter: theme.sfcBackdropFilter,
    [tinyViewOverride]: {
      gridTemplateColumns: '1fr',
    },
    '& .valid': {
      color: theme.fgPrimary,
    },
    '& .checkArea': {
      display: 'inline-block',
      minWidth: '2em',
    },
  },
}))

type PasswordRequirement = {
  i18nKey: string
  check: (password: string, passwordRetype: string) => boolean
}

interface IPasswordRequirementsItem {
  requirement: PasswordRequirement
  password: string
  passwordRetype: string
}

const PasswordRequirementsItem: React.FunctionComponent<IPasswordRequirementsItem> =
  ({requirement, password, passwordRetype}) => {
    const {t} = useTranslation('sign-up-pages')
    const isValid = requirement.check(password, passwordRetype)
    return (
      <div className={isValid ? 'valid' : undefined}>
        <span className='checkArea'>
          {isValid && <Icon inline stroke='checkmark' />}
        </span>
        {t(requirement.i18nKey)}
      </div>
    )
  }

interface IPasswordRequirementsBox {
  requirements: PasswordRequirement[]
  password: string
  passwordRetype: string
}

const PasswordRequirementsBox: React.FunctionComponent<IPasswordRequirementsBox> =
  ({requirements, password, passwordRetype}) => {
    const {box} = useStyles()
    return (
      <div className={box}>
        {requirements.map(r => (
          <PasswordRequirementsItem
            key={r.i18nKey}
            requirement={r}
            password={password}
            passwordRetype={passwordRetype}
          />
        ))}
      </div>
    )
  }

export default PasswordRequirementsBox
