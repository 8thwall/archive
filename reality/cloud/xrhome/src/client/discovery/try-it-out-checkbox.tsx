import React from 'react'
import {useTranslation} from 'react-i18next'

import {TRY_IT_OUT_SEARCH_PARAM} from '../../shared/discovery-constants'
import {DiscoveryContext} from './discovery-context'
import {StandardCheckboxField} from '../ui/components/standard-checkbox-field'
import {useBooleanUrlState} from '../hooks/url-state'

const TryItOutCheckbox = () => {
  const {t} = useTranslation(['public-featured-pages'])
  const {pageName} = React.useContext(DiscoveryContext)

  const [isChecked, setIsChecked] = useBooleanUrlState(TRY_IT_OUT_SEARCH_PARAM, false)

  return (
    <StandardCheckboxField
      checked={isChecked}
      label={t('discovery_page.checkbox.label.playable')}
      onChange={e => setIsChecked(e.target.checked)}
      a8={`click;${pageName};${!isChecked ? 'select' : 'unselect'}-try-it-out-filter`}
    />
  )
}

export default TryItOutCheckbox
