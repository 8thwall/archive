import * as React from 'react'
import {Label, Popup, Icon, List} from 'semantic-ui-react'
import '../../static/styles/licenses.scss'

const DisabledAppLabel = ({className, resolutionInstructions}) => (
  <div className={`disabled-app-label ${className || ''}`}>
    <Popup
      on='hover'
      position='bottom center'
      content={<List items={resolutionInstructions} bulleted />}
      trigger={<Icon name='exclamation circle' className='cherry' />}
    />
    <Label className='DISABLED-app-label' content='DISABLED' />
  </div>
)

export default DisabledAppLabel
