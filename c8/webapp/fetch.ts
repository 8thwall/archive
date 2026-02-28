export function fetchJson(url, options = {}) {
  return async (dispatch, getState) => {
    return fetch(url, {
      credentials: 'same-origin',
      ...options,
    }).then(res => res.json())
  }
}
