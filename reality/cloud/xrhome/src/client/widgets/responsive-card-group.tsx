import React from 'react'
import {Card} from 'semantic-ui-react'

import {useSelector} from '../hooks'

type IResponsiveCardGroup = Omit<React.ComponentProps<typeof Card.Group>, 'itemsPerRow'>

const ResponsiveCardGroup: React.FC<IResponsiveCardGroup> = ({children, ...rest}) => {
  const itemsPerRow = useSelector((s) => {
    if (s.common.isTinyScreen) {
      return 1
    } else if (s.common.isSmallScreen) {
      return 2
    } else {
      return 3
    }
  })
  return <Card.Group {...rest} itemsPerRow={itemsPerRow}>{children}</Card.Group>
}

export {
  ResponsiveCardGroup,
}
