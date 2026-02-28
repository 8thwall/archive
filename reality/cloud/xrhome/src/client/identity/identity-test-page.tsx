import React from 'react'

import {SocialLoginButtons} from '../user/social-login-buttons'
import type {SignUpUserNianticRequest} from '../../shared/users/users-niantic-types'

// TODO(Brandon): After testing all identity UI, delete this file and remove route from
// app-switch.tsx
const IdentityTestPage = () => {
  const getProviderTokens = ({providerToken, authProviderId}: SignUpUserNianticRequest) => {
    // eslint-disable-next-line no-console
    console.log({providerToken, authProviderId})
  }

  return (
    <div>
      {/* eslint-disable-next-line local-rules/hardcoded-copy */}
      <h1>Identity Test Page</h1>
      <SocialLoginButtons onSigninCallback={getProviderTokens} />
    </div>
  )
}

export {
  IdentityTestPage as default,
}
