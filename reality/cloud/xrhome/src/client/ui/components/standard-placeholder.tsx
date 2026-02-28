import React from 'react'
import {Placeholder} from 'semantic-ui-react'

import {useStandardPlaceholderStyles} from '../hooks/use-standard-placeholder-styles'

interface IStandardPlaceholder {
  fluid?: boolean
  children?: React.ReactNode
}

const StandardPlaceholder: React.FC<IStandardPlaceholder> = ({
  children, fluid = false,
}) => {
  const classes = useStandardPlaceholderStyles()
  return (
    <Placeholder className={classes.standardPlaceholder} fluid={fluid}>
      {children}
    </Placeholder>
  )
}

export {StandardPlaceholder}
