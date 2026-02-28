import React from 'react'

const ForumLink = ({className = '', children, ...rest}) => (
  <a
    className={className}
    href='https://forum.8thwall.com'
    target='_blank'
    rel='noopener noreferrer'
    {...rest}
  >{children}
  </a>
)

export default ForumLink
