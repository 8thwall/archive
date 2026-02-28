/* eslint-disable max-len */
// Keys are managed by the `dlee@nianticlabs.com` login at https://account.mapbox.com/
// Talk to Paris Morgan (parismorgan@nianticlabs.com) or Helena Tan (htan@nianticlabs.com) for
// access.
const MAPBOX_API_KEY = BuildIf.ALL_QA
  ? 'pk.<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>'
  : 'pk.<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>'

const MAP_STYLE = {
  sattelite: 'mapbox://styles/<REMOVED_BEFORE_OPEN_SOURCING>/<REMOVED_BEFORE_OPEN_SOURCING>',
  default: 'mapbox://styles/<REMOVED_BEFORE_OPEN_SOURCING>/<REMOVED_BEFORE_OPEN_SOURCING>',
}

module.exports = {
  MAPBOX_API_KEY,
  MAP_STYLE,
}
