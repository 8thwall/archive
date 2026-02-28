const hasUserSession = state => !!state.userNiantic.loggedInUser || !!state.user.jwt

/* eslint-disable import/prefer-default-export */
export {
  hasUserSession,
}
