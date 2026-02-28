import React from 'react'

import {Redirect, useLocation} from 'react-router-dom'

import querystring from 'query-string'

import ErrorMessage from '../home/error-message'

import userActions from './user-actions'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import useActions from '../common/use-actions'
import {useUserHasSession} from './use-current-user'
import {Loader} from '../ui/components/loader'

/* eslint-disable max-len */
// To test this page use these query params:
// - www.8thwall.com/login/wayfarer?client_id=clientIdTest&response_type=code&redirect_uri=https://nma.eng.<REMOVED_BEFORE_OPEN_SOURCING>.com/nma/the8thwallcallback&scope=testScope&state=testState&code_challenge=testCodeChallenge}&arkp=1&
// You should be redirected to https://nma.eng.<REMOVED_BEFORE_OPEN_SOURCING>.com/nma/the8thwallcallback with authCode,
// scope, and state query params. If you'd like a working JWT returned in authCode you'll need to
// pass the correct client_id and redirect_uri for your environment. You can find these here:
// - https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/niantic-ar/ar-mapping/supermapper/-/blob/main/client/buildSrc/src/main/groovy/com/nianticproject/gradle/supermapper/SuperMapperConfig.groovy#L74
// - https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/niantic-ar/8w/code8/-/blob/master/reality/cloud/xrhome/src/server/controllers/users-controller.ts#L74
/* eslint-enable max-len */
const WayfarerLoginPage: React.FC<{}> = () => {
  const {getWayfarerSessionToken} = useActions(userActions)
  const isLoggedIn = useUserHasSession()
  const location = useLocation()
  const parsedQueryString: Record<string, string> = querystring.parse(location.search)

  useAbandonableEffect(async (abandon) => {
    if (!isLoggedIn) {
      return
    }
    const result = await abandon(
      getWayfarerSessionToken(
        parsedQueryString.client_id,
        parsedQueryString.redirect_uri,
        parsedQueryString.scope,
        parsedQueryString.state,
        parsedQueryString.code_challenge
      )
    )
    if (result.url) {
      window.location.href = result.url
    }
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <Redirect to={
        `/login${location.search}redirectTo=/login/wayfarer&hideHeader=true&hideForgotPassword=
true&preserveQuery=true&hideThirdPartyLogins=true`}
      />
    )
  }

  return (
    <>
      <ErrorMessage />
      <Loader />
    </>
  )
}

export default WayfarerLoginPage
