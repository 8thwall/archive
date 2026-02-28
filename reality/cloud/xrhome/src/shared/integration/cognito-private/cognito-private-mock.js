import uuidv4 from 'uuid/v4'

const createUserStore = () => {
  const store = {
    Users: [],
  }

  const addUser = (user) => {
    store.Users.push(user)
  }

  const getUsers = () => ({...store})

  const reset = () => {
    store.Users = []
  }

  return {
    addUser,
    getUsers,
    reset,
  }
}

const makeThrowFunction = name => (() => {
  const msg = `Called mocked ${name} without stubbing`
  // Log and throw in case there is a try/catch
  // eslint-disable-next-line no-console
  console.error(msg)
  throw new Error(msg)
})

const createMockedCognito = () => ({
  listUsers: makeThrowFunction('listUsers'),
  adminUpdateUserAttributes: makeThrowFunction('adminUpdateUserAttributes'),
  adminGetUser: makeThrowFunction('adminGetUser'),
  addUserInfo: makeThrowFunction('addUserInfo'),
  getUserAttributeVerificationCode: makeThrowFunction('getUserAttributeVerificationCode'),
  verifyUserAttribute: makeThrowFunction('verifyUserAttribute'),
  adminInitiateAuth: makeThrowFunction('adminInitiateAuth'),
  config: {
    region: 'fake-region',
    UserPoolId: 'fake-user-pool',
    ClientId: 'fake-client',
  },
})

// Helper method to generate cognito-like async responses
// Consumers can call cognito.listUsers(...).promise() or cognito.listUsers(..., callback)
// Mocked functions can call return cognitoAsync(callback, result) to handle both theses usages
const cognitoAsync = (callback, result) => {
  if (callback) {
    callback(null, result)
  }
  return {promise: () => Promise.resolve(result)}
}

const cognitoAsyncError = (callback, message, code = null) => {
  const error = new Error(message)
  if (code) {
    error.code = code
  }
  if (callback) {
    callback(error, null)
  }

  return {promise: () => Promise.reject(error)}
}

const USER_ACCOUNT_ATTRIBUTES = ['email']

const findUserByAttribute = (users, attributeName, attributeValue) => {
  let foundUser
  if (!USER_ACCOUNT_ATTRIBUTES.includes(attributeName)) {
    foundUser = users.find(u => u.Username === attributeValue)
  } else {
    foundUser = users.find(u => (u.Attributes.find(att => (
      att.Name === attributeName && att.Value === attributeValue
    ))))
  }

  if (!foundUser) {
    return []
  }

  return [foundUser]
}

const createInMemoryCognito = () => {
  const userStore = createUserStore()
  const listUsers = ({Filter}, callback) => {
    const users = userStore.getUsers().Users
    // The filter decides the uuid we're accessing. It looks something like
    // 'sub = "SOME_UUID"' or 'email = "email@8thwall.com"'.
    const [attributeName, attributeValue] = Filter.split(' = ')
    const cleanedAttributeValue = attributeValue.replace(/"/g, '')
    const user = findUserByAttribute(users, attributeName, cleanedAttributeValue)

    return cognitoAsync(callback, {Users: [...user]})
  }

  const adminGetUser = ({Username}, callback) => {
    const user = userStore.getUsers().Users.find(u => u.Username === Username)
    if (!user) {
      return cognitoAsyncError(callback, 'Could not find user')
    }
    return cognitoAsync(callback, {Username, 'UserAttributes': user.Attributes})
  }

  const adminCreateUser = ({Username, UserAttributes}, callback) => {
    const userUuid = uuidv4()
    const attributes = [...UserAttributes]
    const emailAttribute = attributes.find(attr => attr.Name === 'email')
    if (!emailAttribute) {
      attributes.push({Name: 'email', Value: Username})
    }
    userStore.addUser({Username: userUuid, Attributes: UserAttributes})
    return cognitoAsync(callback, {User: {Username: userUuid, Attributes: UserAttributes}})
  }

  const signUp = ({UserAttributes}, callback) => {
    const userUuid = uuidv4()
    userStore.addUser({Username: userUuid, Attributes: UserAttributes})
    return cognitoAsync(callback, {UserSub: userUuid})
  }

  const createFakeJwt = (payload) => {
    const payloadString = JSON.stringify(payload)
    const encodedPayload = Buffer.from(payloadString).toString('base64')

    return `header.${encodedPayload}.signature`
  }

  const adminInitiateAuth = ({AuthParameters}, callback) => {
    const {USERNAME: username, PASSWORD: password} = AuthParameters
    if (password === 'Badpassword1') {
      return cognitoAsyncError(callback, 'Invalid password', 'NotAuthorizedException')
    }

    const user = findUserByAttribute(userStore.getUsers().Users, 'email', username)[0]
    const accessToken = user ? createFakeJwt({sub: user.Username}) : 'mockAccessToken'

    return cognitoAsync(callback, {
      AuthenticationResult: {
        AccessToken: accessToken,
      },
    })
  }

  const getUserAttributeVerificationCode = (_, callback) => cognitoAsync(callback, {
    CodeDeliveryDetails: {
      AttributeName: 'email',
      DeliveryMedium: 'EMAIL',
      Destination: 'fake@8thwall.com',
    },
  })

  const verifyUserAttribute = ({Code}, callback) => {
    if (Code !== '123456') {
      return cognitoAsyncError(callback, 'Invalid code')
    }

    return cognitoAsync(callback, null)
  }

  const adminDeleteUser = ({Username}, callback) => {
    const users = userStore.getUsers().Users
    const newUsers = users.filter(u => u.Username !== Username)
    userStore.Users = newUsers
    return cognitoAsync(callback, null)
  }

  return {
    listUsers,
    adminGetUser,
    adminCreateUser,
    adminDeleteUser,
    signUp,
    adminInitiateAuth,
    getUserAttributeVerificationCode,
    verifyUserAttribute,
    config: {
      region: 'fake-region',
      UserPoolId: 'fake-user-pool',
      ClientId: 'fake-client',
    },
    reset: () => userStore.reset(),
  }
}

export {
  createMockedCognito,
  cognitoAsync,
  createInMemoryCognito,
}
