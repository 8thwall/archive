import type {IApp} from '../common/types/models'

const getAccessDateValue = (app: IApp) => (
  app.userSpecific && app.userSpecific.accessDate && new Date(app.userSpecific.accessDate).valueOf()
) || 1e6

export const sortByDescAccessDate =
(a: IApp, b: IApp) => getAccessDateValue(b) - getAccessDateValue(a)
