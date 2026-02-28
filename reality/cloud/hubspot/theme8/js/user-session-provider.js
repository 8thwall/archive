/* eslint-disable */
(function () {
  const CACHED_USER_UUID_KEY = 'userUuid'
  const CACHED_REFRESH_TIME_KEY = 'refreshTime'
  const cognitoStorage = new window.CognitoStorage()

  const EXCLUDED_FIELDS = [
    'password', 'pwconf', 'sub', 'uuid', 'emailVerified', 'phoneNumberVerified', 'avatar',
    'message', 'error', 'recaptcha', 'action', 'crmId',
  ]

  const cacheUserNiantic = async (user) => {
    await Promise.all([
      localforage.setItem(CACHED_USER_UUID_KEY, user.userUuid),
      localforage.setItem(CACHED_REFRESH_TIME_KEY, user.refreshTime),
    ])
  }

  const clearCachedUserNiantic = async () => {
    await Promise.all([
      localforage.removeItem(CACHED_USER_UUID_KEY),
      localforage.removeItem(CACHED_REFRESH_TIME_KEY),
    ])
  }

  const signOutAndClearCognitoCookies = async () => {
    await clearCachedUserNiantic()
    cognitoStorage.clear()
    window.location.reload()
  }

  const authenticatedFetch = async (route, options, user) => {
    if (!user) {
      await signOutAndClearCognitoCookies()
    }

    if (user.refreshTime < Date.now()) {
      await refresh8wJwt()
    }

    const res = await fetch(route, options)
    const contentType = res.headers.get('Content-Type')
    const isJsonResponse = contentType && contentType.indexOf('json') > 0

    if (isJsonResponse) {
      return res.json()
    }
    return res.text()
  }

  const logOut = async (user) => {
    try {
      await authenticatedFetch(
        '/v1/users/niantic/logout',
        {
          credentials: 'same-origin',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        user
      )
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.message) // fail silently
    }
    await signOutAndClearCognitoCookies()
  }

  const getCurrentUser = async () => {
    const [userUuid, refreshTime] =
      await Promise.all([
        localforage.getItem(CACHED_USER_UUID_KEY),
        localforage.getItem(CACHED_REFRESH_TIME_KEY),
      ])

    if (!userUuid || !refreshTime) {
      return null
    }

    return {userUuid, refreshTime}
  }

  const getAttributes = async (user) => {
    try {
      const res = await authenticatedFetch(
        '/v1/users/niantic',
        {
          credentials: 'same-origin',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        user
      )
      return res
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.message) // fail silently
    }
  }

  // Update user attributes on xrhome server
  const updateAttributes = async (attributes, user) => {
    const attributesToUpdate = Object.keys(attributes).reduce((acc, key) => {
      if (!EXCLUDED_FIELDS.some((f) => f === key)) {
        acc[key] = attributes[key]
      }
      return acc
    }, {})

    try {
      const res = await authenticatedFetch(
        '/v1/users',
        {
          credentials: 'same-origin',
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(attributesToUpdate),
        },
        user
      )
      return res
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.message) // fail silently
    }
  }

  const refresh8wJwt = async () => {
    const res = await fetch('/api/public/users/niantic/login/refresh', {method: 'POST'})
    if (!res.ok) {
      throw new Error('Fail to refresh 8w access token')
    }

    // Cache new current user and refresh time
    const newUser = await res.json()
    cacheUserNiantic(newUser)
  }

  let currentUserAttributes = null

  const getCurrentUserAttributes = () => {
    return currentUserAttributes
  }

  const signOut = async () => {
    const currentUser = await getCurrentUser()
    if (currentUser) {
      logOut(currentUser)
    }
  }

  const updateUserAttributes = async (attributes) => {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUserAttributes) {
      return
    }

    try {
      await updateAttributes(attributes, currentUser)

      currentUserAttributes = {
        ...currentUserAttributes,
        ...attributes,
      }
    } catch (err) {
      console.error(err)
    }
  }

  const initCurrentUserSession = async () => {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return null
    }

    const fetchAttributes = async () => {
      if (currentUser) {
        const res = await getAttributes(currentUser)
        if (res) {
          const {niantic, user} = res
          if (niantic?.profilePhotoUrl) {
            user.profilePhotoUrl = niantic.profilePhotoUrl
          }
          user.profilePhotoMonogram = niantic.profilePhotoMonogram
          currentUserAttributes = user
        }
      }
    }

    await fetchAttributes()
  }

  const loadUserSession = async () => {
    if (!currentUserAttributes) {
      await initCurrentUserSession()
    }

    if (!currentUserAttributes) {
      return null
    }

    return {
      getCurrentUserAttributes,
      signOut,
      updateUserAttributes,
    }
  }

  window.UserSessionProvider = {
    get: async () => loadUserSession()
  }
})();
