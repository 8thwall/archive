import {z} from 'zod'

import {requestSchema} from '../schema/common'
import {Tool} from '../factory/tool-factory'

// TODO(kyle): Adding descriptions to parameters will improve our LLM's understanding.
const META_TOOLS = [
  Tool.create(
    'batch',
    'Execute multiple requests in a single batch to avoid timeouts and improve performance. This is especially useful for creating or manipulating many objects at once.\n\nThe tool takes an object with a "requests" property containing an array of requests, where each request has:\n- action: The name of the action to perform (e.g., "create_object_3d", "set_object_position")\n- parameters: The parameters for that action\n\nUse this tool when you need to:\n- Create many objects at once (e.g., 100 spheres in a circle)\n- Apply the same action to many objects\n- Perform a sequence of related requests that should be atomic\n- Avoid timeouts when performing complex scene manipulations\n\nThe function returns an array of responses, one for each request, with success/error information.',
    z.object({requests: z.array(requestSchema)})
  ),
]

export {
  META_TOOLS,
}
