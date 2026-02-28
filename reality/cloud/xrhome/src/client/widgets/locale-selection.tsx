import React from 'react'

import {StandardDropdownField} from '../ui/components/standard-dropdown-field'
import {getSupportedLocale8wOptions} from '../../shared/i18n/i18n-locales'
import {LocaleDropdown} from './locale-dropdown'
import {useLocaleChange} from '../user/use-locale'

interface ILocalSelection {
  mini?: boolean
}

const LocaleSelection: React.FC<ILocalSelection> = ({mini}) => {
  const [currentLocale, setLocale] = useLocaleChange()

  return mini
    ? <LocaleDropdown
        onChange={setLocale}
    />
    : <StandardDropdownField
        label=''
        id='locale-selection'
        options={getSupportedLocale8wOptions()}
        value={currentLocale}
        height='tiny'
        onChange={setLocale}
    />
}

export {
  LocaleSelection,
}
