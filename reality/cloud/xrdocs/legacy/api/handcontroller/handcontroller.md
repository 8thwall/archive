# XR8.HandController

## Description {#description}

`HandController` provides hand detection and meshing, and interfaces for configuring tracking.

- `HandController` and `XrController` cannot be used at the same time.
- `HandController` and `LayersController` cannot be used at the same time.
- `HandController` and `FaceController` cannot be used at the same time.

## Functions {#functions}

Function | Description
-------- | -----------
[configure](configure.md) | Configures what processing is performed by HandController.
[pipelineModule](pipelinemodule.md) | Creates a camera pipeline module that, when installed, receives callbacks on when the camera has started, camera proessing events, and other state changes. These are used to calculate the camera's position.
[AttachmentPoints](attachmentpoints.md) | Points on the hand you can anchor content to.
