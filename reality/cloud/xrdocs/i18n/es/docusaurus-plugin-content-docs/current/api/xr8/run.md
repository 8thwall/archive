---
sidebar_label: run()
---

# XR8.run()

`XR8.run(canvas, webgl2, ownRunLoop, cameraConfig, glContextConfig, allowedDevices, sessionConfiguration)`

## Descripción {#description}

Abre la cámara y empieza a ejecutar el bucle de ejecución de la cámara.

## Parámetros {#parameters}

| Propiedad                                                                                         | Tipo                                            | Por defecto                                 | Descripción                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| canvas                                                                                            | `HTMLCanvasElement`                             |                                             | El lienzo HTML en el que se dibujará la imagen de la cámara.                                                                                                                                                                                                                                                                                                                                                  |
| webgl2 [Opcional]                                                                                 | `Boolean`                                       | `true`                                      | Si es verdadero, utiliza WebGL2 si está disponible; si no, pasa a WebGL1.  Si es falso, utiliza siempre WebGL1.                                                                                                                                                                                                                                                                                               |
| ownRunLoop [Opcional]                                                                             | `Boolean`                                       | `true`                                      | Si es verdadero, XR debe utilizar su propio bucle de ejecución.  Si es falso, proporcionarás tu propio bucle de ejecución y serás responsable de llamar tú mismo a [runPreRender](runprerender.md) y [runPostRender](runpostrender.md) [Sólo usuarios avanzados]                                                                                                                                              |
| cameraConfig: {direction} [Opcional]                                                              | `Objeto`                                        | `{direction: XR8.XrConfig.camera().BACK}`   | Cámara que desea utilizar. Los valores admitidos para la `dirección` son `XR8.XrConfig.camera().BACK` o `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                                                                         |
| glContextConfig [Opcional]                                                                        | `WebGLContextAttributes`                        | `nulo`                                      | Los atributos para configurar el contexto del lienzo WebGL.                                                                                                                                                                                                                                                                                                                                                   |
| allowedDevices [Optional]                                                                         | [`XR8.XrConfig.device()`](/api/xrconfig/device) | `XR8.XrConfig.device().MOBILE_AND_HEADSETS` | Especifica la clase de dispositivos en los que debe ejecutarse la canalización.  Si el dispositivo actual no pertenece a esa clase, la ejecución fallará antes de abrir la cámara. Si allowedDevices es `XR8.XrConfig.device().ANY`, abre siempre la cámara. Ten en cuenta que el seguimiento mundial sólo puede utilizarse con `XR8.XrConfig.device().MOBILE_AND_HEADSETS` o `XR8.XrConfig.device().MOBILE`. |
| sessionConfiguration: `{disableXrTablet, xrTabletStartsMinimized, defaultEnvironment}` [Opcional] | `Objeto`                                        | `{}`                                        | Configura las opciones relacionadas con los distintos tipos de sesiones.                                                                                                                                                                                                                                                                                                                                      |

`sessionConfiguration` es un objeto con las siguientes propiedades [Opcionales]:

| Propiedad                                                                                                                                        | Tipo      | Por defecto | Descripción                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ----------- | -------------------------------------------------------------------------------------- |
| disableXrTablet [Opcional]                                                                                                                       | `Boolean` | `false`     | Desactiva la tableta visible en las sesiones inmersivas.                               |
| xrTabletStartsMinimized [Opcional]                                                                                                               | `Boolean` | `false`     | La tableta se iniciará minimizada.                                                     |
| defaultEnvironment `{disabled, floorScale, floorTexture, floorColor, fogIntensity, skyTopColor, skyBottomColor, skyGradientStrength}` [Opcional] | `Objeto`  | {}          | Configura las opciones relacionadas con el entorno por defecto de tu sesión inmersiva. |

`defaultEnvironment` es un objeto con las siguientes propiedades [Opcionales]:

| Propiedad                      | Tipo              | Por defecto | Descripción                                                                      |
| ------------------------------ | ----------------- | ----------- | -------------------------------------------------------------------------------- |
| disabled [Opcional]            | `Boolean`         | `false`     | Desactiva el fondo "void space" por defecto.                                     |
| floorScale [Opcional]          | `Number`          | `1`         | Reduce o aumenta la textura del suelo.                                           |
| floorTexture [Opcional]        | Activo            |             | Especifica un activo de textura alternativo o una URL para el suelo de baldosas. |
| floorColor [Opcional]          | Color hexadecimal | `#1A1C2A`   | Establece el color del suelo.                                                    |
| fogIntensity [Opcional]        | `Number`          | `1`         | Aumenta o disminuye la densidad de la niebla.                                    |
| skyTopColor [Opcional]         | Color hexadecimal | `#BDC0D6`   | Establece el color del cielo directamente sobre el usuario.                      |
| skyBottomColor [Opcional]      | Color hexadecimal | `#1A1C2A`   | Fija el color del cielo en el horizonte.                                         |
| skyGradientStrength [Opcional] | `Number`          | `1`         | Controla la nitidez de las transiciones del degradado del cielo.                 |

Notas:

* `cameraConfig`: El seguimiento del mundo (SLAM) sólo es compatible con la cámara trasera `` .  Si utilizas la cámara frontal `` , debes desactivar el seguimiento mundial llamando primero a `XR8.XrController.configure({disableWorldTracking: true})`.

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
// Abre la cámara y empieza a ejecutar el bucle de ejecución de cámara
// En index.html: <canvas id="camerafeed"></canvas>
XR8.run({canvas: document.getElementById('camerafeed')})
```

## Ejemplo - Uso de la cámara frontal (sólo seguimiento de imagen) {#example---using-front-camera-image-tracking-only}

```javascript
// Desactiva el seguimiento del mundo (SLAM). Esto es necesario para utilizar la cámara frontal.
XR8.XrController.configure({disableWorldTracking: true})
// Abre la cámara y empieza a ejecutar el bucle de ejecución de cámara
// En index.html: <canvas id="camerafeed"></canvas>
XR8.run({canvas: document.getElementById('camerafeed'), cameraConfig: {direction: XR8.XrConfig.camera().FRONT}})
```

## Ejemplo - Configurar glContextConfig {#example---set-glcontextconfig}

```javascript
// Abre la cámara y comienza a ejecutar el bucle de ejecución de cámara con un lienzo opaco.
// En index.html: <canvas id="camerafeed"></canvas>
XR8.run({canvas: document.getElementById('camerafeed'), glContextConfig: {alpha: false, preserveDrawingBuffer: false}})
```
