import * as React from 'react'

import Title from './title'

interface IHeadingTitle {
  children: string
  className: string
}

const HeadingTitle: React.FunctionComponent<IHeadingTitle> = ({children, className}) => (
  <h1 className={className}>
    <Title>{children}</Title>
    {children}
  </h1>
)

export default HeadingTitle
