import {z} from 'zod'

import {objectIdsSchema} from '../schema/common'
import {Tool} from '../factory/tool-factory'
import {
  getObjectsPropertyRequestSchema, setObjectsPropertyRequestSchema,
} from '../schema/scene-tools/objects-property'
import {objectIdSchema} from '../schema/ecs/scene-graph'
import {
  createObjectsRequestSchema, getAvailableComponentsRequestSchema,
} from '../schema/scene-tools'

// TODO(kyle): Adding descriptions to parameters will improve our LLM's understanding.
const SCENE_TOOLS = [
  Tool.create(
    'get_current_scene',
    'Get the complete representation of the current 3D scene as a JSON object. This includes all objects, their properties (position, rotation, scale, materials), hierarchical relationships, lighting, cameras, and scene settings. Use this to analyze the entire scene state, understand what objects exist, their properties, and how they relate to each other. This is useful when you need a comprehensive view of the scene before making changes or when you need to understand the scene structure.',
    z.object({})
  ),

  Tool.create(
    'get_available_components',
    'List all available components that can be added to objects in the scene.',
    getAvailableComponentsRequestSchema
  ),

  Tool.create(
    'create_objects',
    'Create a new 3D object in the scene. This tool allows you to add primitive shapes (like cubes, spheres, planes) or more complex objects to your scene. The created object will have default properties (position at origin, scale of 1, etc.) which you can modify with other tools.',
    createObjectsRequestSchema
  ),

  Tool.create(
    'get_objects_property',
    'Get the property values of objects in the scene. You can specify a list of object IDs to get properties for specific objects, or leave an empty array to get properties of all objects in the scene. Use this to understand the properties of objects in your scene, such as their position, rotation, scale, or material. This is useful when you need to analyze the state of objects or when you need to understand the properties of objects in your scene.',
    getObjectsPropertyRequestSchema
  ),

  Tool.create(
    'set_objects_property',
    'Set the property values of objects in the scene. You can specify a list of object IDs and the properties to modify. Use this to change the properties of objects in your scene, such as their position, rotation, scale, or material. This is useful when you need to modify the state of objects or when you need to change the properties of objects in your scene.',
    setObjectsPropertyRequestSchema
  ),

  Tool.create(
    'set_object_parent',
    'Set a parent-child relationship between two objects in the scene. When an object becomes a child of another:\n\n1. Its position, rotation, and scale become relative to the parent\n2. Moving, rotating, or scaling the parent affects the child\n3. The hierarchy is reflected in the scene graph\n\nThis tool takes a child object and a parent object as parameters. Use this to:\n- Create complex objects from simpler parts\n- Group related objects together\n- Create mechanical relationships (like wheels on a car)\n- Simplify positioning of related objects.',
    z.object({objectId: objectIdSchema, newParentId: objectIdSchema})
  ),

  Tool.create(
    'delete_objects',
    'Remove one or more 3D objects from the scene permanently using their object IDs. Takes an array of object IDs - use a single-element array to delete just one object. When objects are deleted:\n\n1. They are completely removed from the scene graph\n2. Any children of the deleted objects will also be removed unless they are reassigned to another parent\n3. References to the deleted objects will no longer be valid\n\nThis tool takes:\n- objectIds: An array of object IDs to delete.\n\nUse this to:\n- Clean up temporary objects that are no longer needed\n- Remove objects that should disappear during gameplay (like collected items)\n- Replace objects with different ones\n- Optimize scene performance by removing unnecessary objects\n\nBe careful when deleting objects as the operation cannot be undone without recreating the objects.',
    z.object({objectIds: objectIdsSchema})
  ),

  Tool.create(
    'get_random_color',
    'Generate a random color in hexadecimal format (e.g., #FF00FF). This creates a completely random color across the full RGB spectrum. Use this tool to:\n\n- Create visually diverse objects with random appearances\n- Generate color schemes for procedural content\n- Create visual variety in repeated elements\n- Add randomized visual effects\n- Implement color-based gameplay mechanics\n\nThe function requires no parameters and returns a string in the format "#RRGGBB" where RR, GG, and BB are hexadecimal values (00-FF) representing the red, green, and blue components of the color.',
    z.object({})
  ),

  Tool.create(
    'duplicate_objects',
    'Create an exact copy of a 3D objects in the scene. The duplicate will have the same geometry, material, and other properties as the original, but will be a separate object with its own unique ID.\n\nThis tool takes:\n- objectIds: An array of object IDs to duplicate.\n\nUse this to:\n- Create multiple identical objects quickly\n- Make variations of an object by duplicating and then modifying\n- Save time when creating complex scenes with repeating elements\n\nThe function returns a reference to the newly created duplicate object.',
    z.object({objectIds: objectIdsSchema})
  ),
]

export {
  SCENE_TOOLS,
}
