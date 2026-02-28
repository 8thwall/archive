import type HubspotClient from 'hubspot'

import {entry} from '../../registry'

const Hubspot = entry<HubspotClient>('hubspot')

export {Hubspot}
