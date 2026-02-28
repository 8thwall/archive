import React, {useState, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import useActions from '../../common/use-actions'
import helpCenterActions from './help-center-actions'
import {HelpCenterSearchInput} from './help-center-search-input'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import {SearchEntryDropDown} from './search-entry-dropdown'
import {combine} from '../../common/styles'

const useStyles = createUseStyles({
  'helpCenterSearch': {
    width: '100%',
    margin: '1em 0',
    position: 'relative',
  },
  'resourceCenterSearch': {
    margin: '0',
    paddingTop: '0.5em',
  },
})

const HelpCenterSearch: React.FC<{isResourceCenter?: boolean}> = ({isResourceCenter}) => {
  const classes = useStyles()
  const {t} = useTranslation(['app-pages'])
  const {getSearchResults, clearSearchResults} = useActions(helpCenterActions)
  const latestAbortController = useRef<AbortController>()

  const [searchQuery, setSearchQuery] = useState('')

  useAbandonableEffect(async (executor) => {
    // For aborting the last fetch request with search-as-you-type feature
    if (latestAbortController.current) {
      latestAbortController.current.abort()
    }

    latestAbortController.current = new AbortController()
    await executor(getSearchResults(searchQuery, latestAbortController.current.signal))
  }, [searchQuery])

  useAbandonableEffect(() => {
    if (!searchQuery.length) {
      clearSearchResults()
    }
  }, [searchQuery])

  return (
    <div className={combine(classes.helpCenterSearch,
      isResourceCenter && classes.resourceCenterSearch)}
    >
      <HelpCenterSearchInput
        setSearchQuery={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        placeholder={t('in_app_help_center.search_input.placeholder')}
      />
      <SearchEntryDropDown />
    </div>
  )
}

export {
  HelpCenterSearch,
}
