import {loadStripe} from '@stripe/stripe-js'

import {Publishable} from '../../shared/stripe-client-config'

const stripe = loadStripe(Publishable)

export default stripe
