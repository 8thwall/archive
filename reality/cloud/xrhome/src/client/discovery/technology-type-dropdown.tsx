import React from 'react'
import {useTranslation} from 'react-i18next'

import {titleCase} from '../common/strings'
import {TECHNOLOGIES, KEYWORD_SEARCH_PARAM} from '../../shared/discovery-constants'
import {DiscoveryContext} from './discovery-context'
import {encodeQueryParam} from '../../shared/discovery-utils'
import {useStringUrlState} from '../hooks/url-state'
import {StandardDropdownField} from '../ui/components/standard-dropdown-field'
import {SrOnly} from '../ui/components/sr-only'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  technologyTypeDropdown: {
    minWidth: '10em',
  },
  typePrefix: {
    color: theme.fgMuted,
  },
}))

// TODO(kyle): Dropdowns should be exact string matches against OpenSearch. This will require
// updates to both frontend and serve-documents API. For now, we are doing 'AND' queries for
// keywords that are several words e.g. 'image target' -> 'image,target'.
const TechnologyTypeDropdown = () => {
  const [selectedTech, setSelectedTech] = useStringUrlState(KEYWORD_SEARCH_PARAM, 'all')
  const {pageName} = React.useContext(DiscoveryContext)
  const {t} = useTranslation(['public-featured-pages'])
  const classes = useStyles()

  const allItem = {
    key: 'all',
    value: 'all',
    content: t('discovery_page.tech_drop_down.selection.all'),
    a8: `click;${pageName};select-technology-all`,
  }
  const options = TECHNOLOGIES.map(tech => ({
    key: tech.name,
    value: encodeQueryParam(tech.name),
    content: tech.displayName || titleCase(tech.name),
    a8: `click;${pageName};select-technology-${tech.name}`,
  }))

  return (
    <div className={classes.technologyTypeDropdown}>
      <StandardDropdownField
        label={<SrOnly>{t('discovery_page.tech_drop_down.type')}</SrOnly>}
        formatVisibleContent={value => (
          <>
            <span className={classes.typePrefix}>
              {t('discovery_page.tech_drop_down.type')}
            </span>
            &nbsp;
            {value.content}
          </>
        )}
        options={[allItem, ...options]}
        value={selectedTech}
        onChange={setSelectedTech}
      />
    </div>
  )
}

export default TechnologyTypeDropdown
