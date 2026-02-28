import {dispatchify} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import gitActions from '../git/git-actions'
import type {DispatchifiedActions} from '../common/types/actions'

const updatePwaInfo = (appUuid, {
  name, shortName, backgroundColor, themeColor, file, crop,
}, deployment) => (dispatch) => {
  let queryParams = ''
  if (crop) {
    queryParams = `?left=${crop.x}&top=${crop.y}&width=${crop.width}&height=${crop.height}`
  }
  const formData = new FormData()
  if (file) {
    formData.append('image', file)
  }
  if (name) {
    formData.append('name', name)
  }
  if (shortName) {
    formData.append('shortName', shortName)
  }
  if (backgroundColor) {
    formData.append('backgroundColor', backgroundColor)
  }
  if (themeColor) {
    formData.append('themeColor', themeColor)
  }
  return dispatch(authenticatedFetch(`/v1/pwa/updateInfo/${appUuid}${queryParams}`, {
    method: 'PUT',
    body: formData,
    json: false,
  })).then(({pwaInfo}) => {
    dispatch({type: 'PWA_INFO_SET', appUuid, pwaInfo})
    if (deployment && (deployment.master || deployment.staging || deployment.production)) {
      return dispatch(gitActions.redeployBranches(appUuid))
    }
  })
}

const updatePwaEnabled = (appUuid, pwaEnabled) => dispatch => dispatch(
  authenticatedFetch(`/v1/apps/updatePwaEnabled/${appUuid}`, {
    method: 'POST',
    body: JSON.stringify({
      pwaEnabled,
    }),
  })
).then(({app, pwaInfo}) => {
  dispatch({type: 'APPS_UPDATE', app})
  dispatch({type: 'PWA_INFO_SET', appUuid, pwaInfo})
})

export const rawActions = {
  updatePwaEnabled,
  updatePwaInfo,
}

export type PwaActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
