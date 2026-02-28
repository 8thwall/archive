---
sidebar_label: runFaceEffects() (deprecated)
---

# XR8.PlayCanvas.runFaceEffects() (obsoleto)

`XR8.PlayCanvas.runFaceEffects( {pcCamera, pcApp}, [extraModules], config )`

## Descripción {#description}

Abra la cámara y comienza a ejecutar el Seguimiento del Mundo XR y/o los Objetivos de Imagen en una escena PlayCanvas.

## Parámetros {#parameters}

| Parámetro               | Descripción                                                                |
| ----------------------- | -------------------------------------------------------------------------- |
| pcCamera                | La cámara de escena PlayCanvas para conducir con AR.                       |
| pcApp                   | La aplicación PlayCanvas, normalmente `this.app`.                          |
| extraModules [Opcional] | Un conjunto opcional de módulos de canalización adicionales para instalar. |
| config                  | Parámetros de configuración para pasar a [`XR8.run()`](/api/xr8/run)       |

`config` es un objeto con las siguientes propiedades:

| Propiedad                                          | Tipo                                                                                      | Por defecto                               | Descripción                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| canvas                                             | [`HTMLCanvasElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) |                                           | El lienzo HTML en el que se dibujará la imagen de la cámara. Normalmente es el "lienzo de la aplicación".                                                                                                                                                                                                                                                          |
| webgl2 [Optional]                                  | `Booleano`                                                                                | `false`                                   | Si es verdadero, utiliza WebGL2 si está disponible; si no, pasa a WebGL1.  Si es falso, utiliza siempre WebGL1.                                                                                                                                                                                                                                                    |
| ownRunLoop [Opcional]                              | `Booleano`                                                                                | `false`                                   | Si es verdadero, XR debe utilizar su propio bucle de ejecución.  Si es falso, usted proporcionará su propio bucle de ejecución y será responsable de llamar usted mismo a [``](/api/xr8/runprerender)XR8.runPreRender() y [`XR8.runPostRender()`](/api/xr8/runpostrender) [Solo usuarios avanzados]                                                                |
| configuración de la cámara: {direction} [Opcional] | `Objeto`                                                                                  | `{direction: XR8.XrConfig.camera().BACK}` | Cámara que desea utilizar. Los valores admitidos para la `dirección` son `XR8.XrConfig.camera().BACK` o `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                              |
| glContextConfig [Opcional]                         | `WebGLContextAttributes`                                                                  | `nulo`                                    | Los atributos para configurar el contexto del lienzo WebGL.                                                                                                                                                                                                                                                                                                        |
| allowedDevices [Optional]                          | [`XR8.XrConfig.device()`](/api/xrconfig/device)                                           | `XR8.XrConfig.device().MOBILE`            | Especifique la clase de dispositivos en los que debe ejecutarse la canalización.  Si el dispositivo actual no pertenece a esa clase, la ejecución fallará antes de abrir la cámara. Si allowedDevices es `XR8.XrConfig.device().ANY`, abra siempre la cámara. Tenga en cuenta que el seguimiento mundial solo puede utilizarse con `XR8.XrConfig.device().MOBILE`. |

## Vuelta {#returns}

Ninguno
