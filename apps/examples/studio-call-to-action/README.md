# Studio: Call to Action Link

This project demonstrates how to create a 3D label in your scene that redirects users to another website when clicked, using built-in UI elements.

## Components

### call-to-Action

This component takes the user to another webpage when the entity it's attached to is clicked.

#### Functionality

When the call-to-action component is added to an entity:

1. It attaches a click event listener to the entity.
2. When the entity is clicked, the browser opens the specified link.

#### Schema

- link: ecs.string - The URL to which the user will be redirected. (default: "https://www.8thwall.com/get-started").
