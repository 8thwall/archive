import * as React from 'react'
import {Button} from 'semantic-ui-react'

export const DeemphasizedButton = props => (
  <Button {...props} className={`deemphasized-button ${props.className || ''}`} />
)
