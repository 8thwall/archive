import * as Types from '../types'

import {registerAttribute} from '../registry'

const Location = registerAttribute('location', {
  name: Types.string,
  poiId: Types.string,
  lat: Types.f32,
  lng: Types.f32,
  title: Types.string,
  anchorNodeId: Types.string,
  anchorSpaceId: Types.string,
  imageUrl: Types.string,
  anchorPayload: Types.string,
  visualization: Types.string,
}, {
  visualization: 'mesh',
})

export {Location}
