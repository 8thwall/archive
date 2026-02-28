const mainUser = 'fa546766-3f8b-11e9-b210-d663bd873d93'

const firebaseToken = {
  user_id: '2RpVIoepuHVzEaQTZ8q7BnycnCVQ',
  sub: '2RpVIoepuHVzEaQTZ8q7BnycnCVQ',
  email: 'test-user@nianticlabs.com',
  uid: '2RpVIoepuHVzEaQTZ8q7BnycnCVQ',
  jwt: 'test.jwt.token',
}

const cognitoToken = {
  sub: '2bdd91ef-22c6-4980-8eeb-6bcf44a6ef16',
  username: '2bdd91ef-22c6-4980-8eeb-6bcf44a6ef16',
  jwt: 'test.jwt.token',
}

const userMiddleware = (req, res, next) => {
  req.user = req.query._testUser || (req.body && req.body._testUser) || mainUser
  res.locals.userUuid = req.query._testUser || (req.body && req.body._testUser) ||
  req.query._cognitoUser || (req.body && req.body._cognitoUser) || mainUser
  const userUuid = req.query._testUser || (req.body && req.body._testUser) || mainUser
  const firebaseId = req.query._firebaseId || (req.body && req.body._firebaseId)
  const cognitoUuid = req.query._cognitoUser || (req.body && req.body._cognitoUser)
  res.locals.tokenAttributes = firebaseId ? firebaseToken : cognitoToken
  if (firebaseId) {
    res.locals.auth = {firebaseId}
    res.locals.tokenAttributes.jwtSource = 'firebase'
  } else if (cognitoUuid) {
    res.locals.auth = {cognitoUuid}
    res.locals.tokenAttributes.jwtSource = 'cognito'
  } else {
    res.locals.auth = {userUuid}
    res.locals.tokenAttributes.jwtSource = '8w'
  }
  res.locals.tokenAttributes.auth_time = req.query._auth_time ||
    (req.body && req.body._auth_time) ||
    Math.round(Date.now() / 1000)
  if (req.body) {
    delete req.body._testUser
    delete req.body._firebaseId
  }
  delete req.query._testUser
  delete req.query._firebaseId
  next()
}

export {
  userMiddleware,
  mainUser,
}
