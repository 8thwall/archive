import React from 'react'

import NarrowPage from './narrow-page'

interface IErrorPage {
  msg: string
}

const ErrorPage: React.FunctionComponent<IErrorPage> = ({msg = ''}) => (
  <NarrowPage title='Please contact support'>
    <p>{msg}</p>
  </NarrowPage>
)

export default ErrorPage
