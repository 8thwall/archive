import React from 'react'
import {Placeholder} from 'semantic-ui-react'

import {useStandardPlaceholderStyles} from '../hooks/use-standard-placeholder-styles'

interface IStandardPlaceholderLine {
  length?: 'medium' | 'short'
  children?: React.ReactNode
}

const StandardPlaceholderLine: React.FC<IStandardPlaceholderLine> = ({
  length,
  children,
}) => {
  const classes = useStandardPlaceholderStyles()
  return (
    <Placeholder.Line className={classes.standardPlaceholderLine} length={length}>
      {children}
    </Placeholder.Line>
  )
}

export {StandardPlaceholderLine}
