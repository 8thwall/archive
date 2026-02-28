# XR8.CanvasScreenshot

## Descripción {#description}

Proporciona un módulo de canalización de cámara que puede generar capturas de pantalla de la escena actual.

## Funciones {#functions}

| Función                                       | Descripción                                                                                                                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [configure](configure.md)                     | Configura el resultado esperado de las capturas de pantalla del lienzo.                                                                                                      |
| [pipelineModule](pipelinemodule.md)           | Crea un módulo de canalización de cámara que, cuando se instala, recibe llamadas de retorno sobre cuándo se ha iniciado la cámara y cuándo ha cambiado el tamaño del lienzo. |
| [setForegroundCanvas](setforegroundcanvas.md) | Establece un lienzo en primer plano que se mostrará encima del lienzo de la cámara. Debe tener las mismas dimensiones que el lienzo de la cámara.                            |
| [takeScreenshot](takescreenshot.md)           | Devuelve una Promesa que, cuando se resuelve, proporciona un búfer que contiene la imagen comprimida JPEG. Si se rechaza, se proporciona un mensaje de error.                |
