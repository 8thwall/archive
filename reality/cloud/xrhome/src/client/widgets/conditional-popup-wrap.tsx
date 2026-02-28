import React from 'react'
import {Popup} from 'semantic-ui-react'

interface IConditionalPopupWrap {
  wrap: boolean
  message: React.ReactNode
  children: React.ReactElement
}

const ConditionalPopupWrap: React.FC<IConditionalPopupWrap> = ({wrap, children, message}) => {
  if (wrap) {
    return (
      <Popup
        basic
        content={message}
        trigger={children}
      />
    )
  } else {
    return children
  }
}

export {
  ConditionalPopupWrap,
}
