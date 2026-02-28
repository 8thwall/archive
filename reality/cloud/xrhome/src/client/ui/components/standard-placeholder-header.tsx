import React from 'react'
import {Placeholder} from 'semantic-ui-react'

import {useStandardPlaceholderStyles} from '../hooks/use-standard-placeholder-styles'
import {bool, combine} from '../../common/styles'

interface IStandardPlaceholderHeader {
  image?: boolean
  children?: React.ReactNode
}

const StandardPlaceholderHeader: React.FC<IStandardPlaceholderHeader> = ({
  children, image = false,
}) => {
  const classes = useStandardPlaceholderStyles()
  const headerClasses = combine(
    classes.standardPlaceholderHeader,
    bool(image, classes.standardPlaceholderImage)
  )
  return (
    <Placeholder.Header className={headerClasses} image={image}>
      {children}
    </Placeholder.Header>
  )
}

export {StandardPlaceholderHeader}
