import React from 'react'
import {Segment} from 'semantic-ui-react'

import {createThemedStyles} from '../ui/theme'
import {StandardPlaceholder} from '../ui/components/standard-placeholder'
import {StandardPlaceholderHeader} from '../ui/components/standard-placeholder-header'
import {StandardPlaceholderLine} from '../ui/components/standard-placeholder-line'

const useStyles = createThemedStyles(theme => ({
  placeholder: {
    '& .ui.segment': {
      boxShadow: 'none',
      border: 'none',
      padding: '0',
      backgroundColor: theme.bgMain,
    },
  },
}))

const ContentBarPlaceholder = () => {
  const classes = useStyles()

  return (
    <div
      className={classes.placeholder}
    >
      <Segment>
        <StandardPlaceholder>
          <StandardPlaceholderHeader image>
            <StandardPlaceholderLine />
            <StandardPlaceholderLine />
          </StandardPlaceholderHeader>
        </StandardPlaceholder>
      </Segment>
    </div>
  )
}

export default ContentBarPlaceholder
