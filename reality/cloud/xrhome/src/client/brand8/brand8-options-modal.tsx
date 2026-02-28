/* eslint-disable local-rules/hardcoded-copy */
import React from 'react'

import {createThemedStyles, type UiThemeMode} from '../ui/theme'
import {Icon} from '../ui/components/icon'
import {StandardModal} from '../ui/components/standard-modal'
import {StandardCheckboxField} from '../ui/components/standard-checkbox-field'
import {useBrand8QaContext} from './brand8-qa-context'
import {StandardDropdownField} from '../ui/components/standard-dropdown-field'
import AutoHeading from '../widgets/auto-heading'
import {SpaceBetween} from '../ui/layout/space-between'

const useStyles = createThemedStyles(theme => ({
  brand8OptionsTrigger: {
    'position': 'fixed',
    'bottom': '1em',
    'right': '1em',
    'zIndex': 99999,
    'opacity': 0.1,
    'background': theme.sfcBackgroundDefault,
    'color': theme.fgMain,
    'cursor': 'pointer',
    '&:hover': {
      opacity: 1,
    },
  },
  brand8OptionsContent: {
    color: theme.fgMain,
    padding: '1em',
    minWidth: '20rem',
  },
}))

const Brand8OptionsModal = () => {
  const brand8 = useBrand8QaContext()
  const classes = useStyles()
  return (
    <StandardModal trigger={(
      <div className={classes.brand8OptionsTrigger}>
        <Icon block stroke='beaker' />
      </div>
    )}
    >
      {() => (
        <div className={classes.brand8OptionsContent}>
          <AutoHeading>Brand8 Options</AutoHeading>
          <SpaceBetween direction='vertical'>
            <StandardCheckboxField
              label='Outline Semantic components'
              checked={!!brand8.semanticUiOutlineEnabled}
              onChange={e => brand8.update({semanticUiOutlineEnabled: e.target.checked})}
            />
            <StandardDropdownField
              label='Theme Override'
              value={brand8.modeOverride || ''}
              options={[
                {value: '', content: 'None'},
                {value: 'brand8dark', content: 'New Dark'},
                {value: 'brand8light', content: 'New Light'},
                {value: 'dark', content: 'Old Dark'},
                {value: 'light', content: 'Old Light'},
              ] as const}
              onChange={value => brand8.update({modeOverride: (value as UiThemeMode) || null})}
            />
            <StandardDropdownField
              label='Public Navigation'
              value={String(brand8.publicNavigationOverride ?? '')}
              options={[
                {value: '', content: 'Default'},
                {value: 'true', content: 'Force enabled'},
                {value: 'false', content: 'Force disabled'},
              ] as const}
              onChange={(value) => {
                switch (value) {
                  case 'true':
                    return brand8.update({publicNavigationOverride: true})
                  case 'false':
                    return brand8.update({publicNavigationOverride: false})
                  default:
                    return brand8.update({publicNavigationOverride: undefined})
                }
              }}
            />
            <StandardDropdownField
              label='Private Navigation'
              value={String(brand8.privateNavigationOverride ?? '')}
              options={[
                {value: '', content: 'Default'},
                {value: 'true', content: 'Force enabled'},
                {value: 'false', content: 'Force disabled'},
              ] as const}
              onChange={(value) => {
                switch (value) {
                  case 'true':
                    return brand8.update({privateNavigationOverride: true})
                  case 'false':
                    return brand8.update({privateNavigationOverride: false})
                  default:
                    return brand8.update({privateNavigationOverride: undefined})
                }
              }}
            />
          </SpaceBetween>
        </div>
      )}
    </StandardModal>
  )
}

export {
  Brand8OptionsModal,
}
