import React from 'react'
import {createUseStyles} from 'react-jss'

import QuestionMarkIcon from '../../widgets/question-mark-icon'
import {gray3, gray4, gray5} from '../../static/styles/settings'
import {combine} from '../../common/styles'
import {UiThemeProvider} from '../../ui/theme'
import {ResourceCenter} from '../../widgets/resource-center'

const useStyles = createUseStyles({
  'resourceCenterContainer': {
    zIndex: 11,
    position: 'fixed',
    width: '3.7em',
    bottom: '0em',
    display: 'flex',
    flexDirection: 'column',
  },
  'resourceCenterTrigger': {
    'width': '100%',
    'display': 'block',
    'color': `${gray4} !important`,
    'padding': '1em 1.5em',
    'paddingLeft': 0,
    'paddingRight': 0,
    'textAlign': 'center',
    'cursor': 'pointer',

    '&:hover': {
      color: `${gray3} !important`,
      backgroundColor: gray5,
    },
  },
})

const InAppHelpCenter: React.FC = () => {
  const classes = useStyles()
  const maybeDevClass = BuildIf.LOCAL_DEV && 'dev'

  return (
    <div className={combine(classes.resourceCenterContainer, 'sidebar', maybeDevClass)}>
      <UiThemeProvider mode='dark'>
        <ResourceCenter mode='app'>
          {onClick => (
            <button
              type='button'
              className={combine('style-reset', classes.resourceCenterTrigger)}
              onClick={onClick}
            >
              <QuestionMarkIcon />
            </button>
          )}
        </ResourceCenter>
      </UiThemeProvider>
    </div>
  )
}

export {
  InAppHelpCenter,
}
