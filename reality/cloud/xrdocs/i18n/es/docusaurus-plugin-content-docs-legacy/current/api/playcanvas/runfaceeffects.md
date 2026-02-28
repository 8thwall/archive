---
sidebar_label: runFaceEffects() (obsoleto)
---

# XR8.PlayCanvas.runFaceEffects() (obsoleto)

`XR8.PlayCanvas.runFaceEffects( {pcCamera, pcApp}, [extraModules], config )`

## Descripción {#description}

Abre la cámara y comienza a ejecutar XR World Tracking y/o Image Targets en una escena PlayCanvas.

## Parámetros {#parameters}

| Parámetro                                                                   | Descripción                                                                           |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| pcCámara                                                                    | La cámara de escena PlayCanvas para conducir con AR.                  |
| pcApp                                                                       | La aplicación PlayCanvas, normalmente `this.app`.                     |
| extraModules [Opcional] | Una matriz opcional de módulos de tuberías adicionales para instalar. |
| config                                                                      | Parámetros de configuración para pasar a [`XR8.run()`](/legacy/api/xr8/run)           |

`config` es un objeto con las siguientes propiedades:

| Propiedad                                                                                                | Tipo                                                                                             | Por defecto                                                                                                                      | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| lona                                                                                                     | [`HTMLCanvasElement`](https://developer.mozilla.org/en-US/docs/Web/legacy/api/HTMLCanvasElement) |                                                                                                                                  | El lienzo HTML en el que se dibujará la imagen de la cámara. Típicamente es 'application-canvas'.                                                                                                                                                                                                                                                                                                  |
| webgl2 [Opcional]                                    | Booleano                                                                                         | `false`                                                                                                                          | Si es true, utiliza WebGL2 si está disponible, de lo contrario, vuelve a WebGL1.  Si es false, utiliza siempre WebGL1.                                                                                                                                                                                                                                                                             |
| ownRunLoop [Opcional]                                | Booleano                                                                                         | `false`                                                                                                                          | Si es verdadero, XR debe utilizar su propio bucle de ejecución.  Si es falso, usted proporcionará su propio bucle de ejecución y será responsable de llamar a [`XR8.runPreRender()`](/legacy/api/xr8/runprerender) y a [`XR8.runPostRender()`](/legacy/api/xr8/runpostrender) usted mismo [Sólo usuarios avanzados].                           |
| cameraConfig: {direction} [Opcional] | Objeto                                                                                           | \`{dirección: XR8.XrConfig.camera().BACK}\`\` | Cámara deseada. Los valores admitidos para `direction` son `XR8.XrConfig.camera().BACK` o `XR8.XrConfig.camera().FRONT`.                                                                                                                                                                                                                                                                           |
| glContextConfig [Opcional]                           | WebGLContextAttributes                                                                           | "null                                                                                                                            | Los atributos para configurar el contexto del lienzo WebGL.                                                                                                                                                                                                                                                                                                                                                        |
| dispositivospermitidos [Opcional]                    | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device)                                           | `XR8.XrConfig.device().MOBILE`                                                                                                   | Especifique la clase de dispositivos en los que debe ejecutarse la canalización.  Si el dispositivo actual no pertenece a esa clase, la ejecución fallará antes de abrir la cámara. Si allowedDevices es `XR8.XrConfig.device().ANY`, abre siempre la cámara. Tenga en cuenta que el seguimiento mundial sólo puede utilizarse con `XR8.XrConfig.device().MOBILE`. |

## Devuelve {#returns}

Ninguno
