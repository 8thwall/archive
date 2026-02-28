export {default as reducer} from './user-reducer'
export {default as user} from './user-actions'
export {default as middleware} from './user-middleware'

export const registerRoute = '/sign-up'

export const isRegistering = state => [registerRoute].indexOf(state.router.location.pathname) >= 0
