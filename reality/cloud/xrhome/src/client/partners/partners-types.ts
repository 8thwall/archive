import type {IFullAccount} from '../common/types/models'

// Exported from partners-controller
type IPartnerAccount = Pick<IFullAccount, 'name' | 'shortName' | 'publicFeatured' |
 'verifiedPartner' | 'verifiedPremierePartner' | 'icon' | 'bio' | 'url'>

// Top-level redux state.
interface PartnersReduxState {
  premierPartners: any[]
  partners: any[]
}

// Action types.
const GET_PARTNERS = 'GET_PARTNERS'
type PartnersMessage = typeof GET_PARTNERS

// Actions
interface GetPartnersAction {
  type: typeof GET_PARTNERS
  premierPartners: any[]
  partners: any[]
}

type PartnersAction = GetPartnersAction

// Reducer function.
type PartnersReducerFunction = (
  state: PartnersReduxState,
  action: PartnersAction
) => PartnersReduxState

export {
  GET_PARTNERS,
}

export type {
  IPartnerAccount,
  PartnersReduxState,
  PartnersMessage,
  GetPartnersAction,
  PartnersAction,
  PartnersReducerFunction,
}
