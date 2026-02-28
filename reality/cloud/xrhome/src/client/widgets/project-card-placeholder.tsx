import {Segment} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import React from 'react'

import {cardImageRatio} from '../static/styles/settings'
import {combine} from '../common/styles'
import {StandardPlaceholder} from '../ui/components/standard-placeholder'
import {StandardPlaceholderImage} from '../ui/components/standard-placeholder-image'
import {StandardPlaceholderHeader} from '../ui/components/standard-placeholder-header'
import {StandardPlaceholderLine} from '../ui/components/standard-placeholder-line'

const useStyles = createUseStyles({
  placeholder: {
    '& .ui.segment': {
      margin: '0',
      boxShadow: 'none',
      border: 'none',
      padding: '0',
    },
    '& .ui.placeholder .rectangular.image': {
      paddingTop: cardImageRatio,
    },
  },
})

const ProjectCardPlaceholder = ({count, className, showAccountIcon = false}) => {
  const classes = useStyles()

  return (
    <div className={combine(classes.placeholder, className)}>
      {Array.from({length: count}).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Segment key={i}>
          <StandardPlaceholder fluid>
            <StandardPlaceholderImage rectangular />
            <StandardPlaceholderHeader image={showAccountIcon}>
              <StandardPlaceholderLine length='medium' />
              {showAccountIcon && <StandardPlaceholderLine length='short' />}
            </StandardPlaceholderHeader>
          </StandardPlaceholder>
        </Segment>
      ))}
    </div>
  )
}

export default ProjectCardPlaceholder
