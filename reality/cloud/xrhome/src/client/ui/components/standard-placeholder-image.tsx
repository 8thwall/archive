import React from 'react'
import {Placeholder} from 'semantic-ui-react'

import {useStandardPlaceholderStyles} from '../hooks/use-standard-placeholder-styles'

interface IStandardPlaceholderImage {
  rectangular?: boolean
  children?: React.ReactNode
}

const StandardPlaceholderImage: React.FC<IStandardPlaceholderImage> = ({
  rectangular = false,
  children,
}) => {
  const classes = useStandardPlaceholderStyles()
  return (
    <Placeholder.Image rectangular={rectangular} className={classes.standardPlaceholderImage}>
      {children}
    </Placeholder.Image>
  )
}

export {StandardPlaceholderImage}
