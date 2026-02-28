import {Segment} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import React from 'react'

import {combine} from '../common/styles'
import {StandardPlaceholder} from '../ui/components/standard-placeholder'
import {StandardPlaceholderImage} from '../ui/components/standard-placeholder-image'
import {StandardPlaceholderLine} from '../ui/components/standard-placeholder-line'

const useStyles = createUseStyles({
  placeholder: {
    '& .ui.segment': {
      margin: '0',
      boxShadow: 'none',
      border: 'none',
      padding: '0',
      backgroundColor: 'transparent',
    },
    '& .ui.fluid.placeholder': {
      borderRadius: '0.5em',
      marginBottom: '1rem',
    },
  },
  appImagePlaceholder: {
    'width': '8.5em',
    '& .ui.placeholder .rectangular.image': {
      paddingTop: '4em',
    },
  },
  codeBlockPlaceholder: {
    '& .ui.placeholder .rectangular.image': {
      paddingTop: '12em',
    },
  },
  appCardCondensedPlaceholder: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  appCardTextPlaceholder: {
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '0.5rem',
    '& .ui.placeholder .line': {
      width: '9em',
    },
  },
})

const CodeSearchResultsPlaceholder = ({count, className}: {count: number, className?: string}) => {
  const classes = useStyles()

  return (
    <div className={combine(classes.placeholder, className)}>
      {Array.from({length: count}).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Segment key={i}>
          <div className={classes.appCardCondensedPlaceholder}>
            <div className={classes.appImagePlaceholder}>
              <StandardPlaceholder fluid>
                <StandardPlaceholderImage rectangular />
              </StandardPlaceholder>
            </div>
            <div className={classes.appCardTextPlaceholder}>
              <StandardPlaceholder>
                <StandardPlaceholderLine />
                <StandardPlaceholderLine />
              </StandardPlaceholder>
            </div>
          </div>
          <div className={classes.codeBlockPlaceholder}>
            <StandardPlaceholder fluid>
              <StandardPlaceholderImage rectangular />
            </StandardPlaceholder>
          </div>
        </Segment>
      ))}
    </div>
  )
}

export {
  CodeSearchResultsPlaceholder,
}
