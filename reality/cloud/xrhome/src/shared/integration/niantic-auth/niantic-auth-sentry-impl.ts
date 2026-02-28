import {request, type GaxiosResponse} from 'gaxios'

import type {
  AccountResponse,
  LoginRequest, LoginResponse,
  SignUpRequest,
  SignUpResponse,
} from './niantic-auth-types'

const createNianticAuthSentryImpl = (sentryHost: string, appKey: string) => {
  const login = async (body: LoginRequest) => {
    // eslint-disable-next-line camelcase
    const sentryResponse = await request<{niantic_token: string}>({
      url: '/auth',
      baseURL: sentryHost,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      responseType: 'json',
    })

    return {
      ...sentryResponse,
      data: {
        accessToken: sentryResponse.data.niantic_token,
      } as LoginResponse,
    } as GaxiosResponse<LoginResponse>
  }

  const signUp = async (body: SignUpRequest) => {
    // eslint-disable-next-line camelcase
    let sentryResponse = await request<{niantic_token: string}>({
      url: '/auth',
      baseURL: sentryHost,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authProviderId: body.authProviderId,
        providerToken: body.providerToken,
        should_create: body.shouldCreate,
        appKey: body.appKey,
      }),
      responseType: 'json',
    })

    // If the first request succeeds, there is an existing Niantic account. If
    // body.shouldCreate is false, we can send the same request again to sentry to create an
    // 8th wall player to link to this account.
    if (!!sentryResponse.data.niantic_token && !body.shouldCreate) {
      // eslint-disable-next-line camelcase
      sentryResponse = await request<{niantic_token: string}>({
        url: '/auth',
        baseURL: sentryHost,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authProviderId: body.authProviderId,
          providerToken: body.providerToken,
          should_create: true,
          appKey: body.appKey,
        }),
        responseType: 'json',
      })
    }

    return {
      ...sentryResponse,
      data: {
        accessToken: sentryResponse.data.niantic_token,
      } as SignUpResponse,
    } as GaxiosResponse<SignUpResponse>
  }

  const getPlayer = async (authorization: string) => {
    const sentryResponse = await request<AccountResponse>({
      url: '/validate',
      baseURL: sentryHost,
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({appKey}),
      responseType: 'json',
    })

    return {
      ...sentryResponse,
      data: {
        player_id: sentryResponse.data.player_id,
        result: sentryResponse.data.result,
      },
    } as GaxiosResponse<AccountResponse>
  }

  return {
    signUp,
    login,
    getPlayer,
  }
}

export {
  createNianticAuthSentryImpl,
}
