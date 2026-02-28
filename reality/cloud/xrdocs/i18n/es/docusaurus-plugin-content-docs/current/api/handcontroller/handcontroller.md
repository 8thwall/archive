# XR8.HandController

## Descripción {#description}

`HandController` proporciona detección y mallado de manos, e interfaces para configurar el seguimiento.

- `HandController` y `XrController` no pueden utilizarse al mismo tiempo.
- `HandController` y `LayersController` no pueden utilizarse al mismo tiempo.
- `HandController` y `FaceController` no pueden utilizarse al mismo tiempo.

## Funciones {#functions}

| Función                                   | Descripción                                                                                                                                                                                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [configurar](configure.md)                | Configure qué procesamiento realiza HandController.                                                                                                                                                                                               |
| [pipelineModule](pipelinemodule.md)       | Crea un módulo de canalización de cámara que, cuando se instala, recibe llamadas de retorno sobre cuándo se ha iniciado la cámara, eventos de proceso de la cámara y otros cambios de estado. Se utilizan para calcular la posición de la cámara. |
| [Puntos de fijación](attachmentpoints.md) | Puntos en la mano a los que puede anclar contenidos.                                                                                                                                                                                              |
