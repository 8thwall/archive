import React from 'react'
import {Placeholder} from 'semantic-ui-react'

import {useStandardPlaceholderStyles} from '../hooks/use-standard-placeholder-styles'

interface IStandardPlaceholderParagraph {
  children?: React.ReactNode
}

const StandardPlaceholderParagraph: React.FC<IStandardPlaceholderParagraph> = ({
  children,
}) => {
  const classes = useStandardPlaceholderStyles()
  return (
    <Placeholder.Paragraph className={classes.standardPlaceholderParagraph}>
      {children}
    </Placeholder.Paragraph>
  )
}

export {StandardPlaceholderParagraph}
