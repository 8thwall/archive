---
sidebar_label: runXr() (obsoleta)
---

# XR8.PlayCanvas.runXr() (obsoleto)

`XR8.PlayCanvas.runXr( {pcCamera, pcApp}, [extraModules], config )`

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

## Ejemplo {#example}

```javascript
var xrcontroller = pc.createScript('xrcontroller')

// Opcionalmente, se puede desactivar el seguimiento del mundo para aumentar la eficacia al seguir objetivos de imagen.
xrcontroller.attributes.add('disableWorldTracking', {type: 'Boolean'})

xrcontroller.prototype.initialize = function() {
  const disableWorldTracking = this.disableWorldTracking

  // Después de que XR se haya cargado completamente, abre el feed de la cámara y empieza a mostrar AR.
  const runOnLoad = ({pcCamera, pcApp}, extramodules) => () => {
    XR8.xrController().configure({disableWorldTracking})
    // Introduzca el nombre de su lienzo. Normalmente es el "lienzo de la aplicación".
    const config = {canvas: document.getElementById('application-canvas') }
    XR8.PlayCanvas.runXr({pcCamera, pcApp}, extraModules, config)
 }

 // Encuentra la cámara en la escena PlayCanvas, y vincúlala al movimiento del teléfono del usuario en el
 // mundo.
  const pcCamera = XRExtras.PlayCanvas.findOneCamera(this.entity)

 // Mientras XR aún se está cargando, muestra algunas cosas útiles.
  // Almost There: Detecta si el entorno del usuario puede soportar web ar, y si no es así,
 // muestra sugerencias sobre cómo ver la experiencia.
  // Cargando: muestra solicitudes de permiso para la cámara y oculta la escena hasta que esté lista para ser mostrada.
  // Error de tiempo de ejecución: Si algo inesperado sale mal, muestra una pantalla de error.
  XRExtras.Loading.showLoading({onxrloaded: runOnLoad({pcCamera, pcApp: this.app}, [
 // Módulos opcionales que los desarrolladores pueden desear personalizar o tematizar.
    XRExtras.AlmostThere.pipelineModule(), // Detecta los navegadores no compatibles y da pistas.
    XRExtras.Loading.pipelineModule(),           // Gestiona la pantalla de carga al inicio.
    XRExtras.RuntimeError.pipelineModule(),      // Muestra una imagen de error.
  ])})
}
```
