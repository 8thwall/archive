import React from 'react'

import NarrowPage from '../user/sign-up/narrow-page'
import ErrorMessage from './error-message'
import {MainHeader} from '../user/sign-up/widgets/headers'

const ServiceUnavailablePage = () => (
  <NarrowPage title='Service unavailable'>
    <ErrorMessage />
    <MainHeader>Service Unavailable</MainHeader>
    <p>8th Wall service is unavailable at your location.</p>
  </NarrowPage>
)

export default ServiceUnavailablePage
