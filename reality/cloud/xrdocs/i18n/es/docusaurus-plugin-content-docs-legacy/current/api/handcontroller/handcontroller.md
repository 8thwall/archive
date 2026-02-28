# XR8.HandController

## Descripción {#description}

`HandController` proporciona detección y mallado de manos, e interfaces para configurar el seguimiento.

- No se pueden utilizar al mismo tiempo `HandController` y `XrController`.
- No se pueden utilizar al mismo tiempo `HandController` y `LayersController`.
- No se pueden utilizar al mismo tiempo `HandController` y `FaceController`.

## Funciones {#functions}

| Función                                 | Descripción                                                                                                                                                                                                                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [configure](configure.md)               | Configura qué procesamiento realiza HandController.                                                                                                                                                                                                            |
| [pipelineModule](pipelinemodule.md)     | Crea un módulo de canalización de cámara que, cuando se instala, recibe llamadas de retorno sobre cuándo se ha iniciado la cámara, eventos de proceso de cámara y otros cambios de estado. Se utilizan para calcular la posición de la cámara. |
| [AttachmentPoints](attachmentpoints.md) | Puntos en la mano a los que puedes anclar contenidos.                                                                                                                                                                                                          |
