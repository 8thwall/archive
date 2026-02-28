---
sidebar_label: ejecutar()
---

# XR8.run()

`XR8.run(canvas, webgl2, ownRunLoop, cameraConfig, glContextConfig, allowedDevices, sessionConfiguration)`

## Descripción {#description}

Abra la cámara y comience a ejecutar el bucle de ejecución de la cámara.

## Parámetros {#parameters}

| Propiedad                                                                                                                                                             | Tipo                                                   | Por defecto                                                                                                                      | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| lona                                                                                                                                                                  | `HTMLCanvasElement`                                    |                                                                                                                                  | El lienzo HTML en el que se dibujará la imagen de la cámara.                                                                                                                                                                                                                                                                                                                                                                                                   |
| webgl2 [Opcional]                                                                                                 | Booleano                                               | `true`                                                                                                                           | Si es true, utiliza WebGL2 si está disponible, de lo contrario, vuelve a WebGL1.  Si es false, utiliza siempre WebGL1.                                                                                                                                                                                                                                                                                                                         |
| ownRunLoop [Opcional]                                                                                             | Booleano                                               | `true`                                                                                                                           | Si es verdadero, XR debe utilizar su propio bucle de ejecución.  Si es falso, usted proporcionará su propio bucle de ejecución y será responsable de llamar [runPreRender](runprerender.md) y [runPostRender](runpostrender.md) usted mismo [Sólo usuarios avanzados].                                                                                                                     |
| cameraConfig: {direction} [Opcional]                                                              | Objeto                                                 | \`{dirección: XR8.XrConfig.camera().BACK}\`\` | Cámara deseada. Los valores admitidos para `direction` son `XR8.XrConfig.camera().BACK` o `XR8.XrConfig.camera().FRONT`.                                                                                                                                                                                                                                                                                                                       |
| glContextConfig [Opcional]                                                                                        | WebGLContextAttributes                                 | "null                                                                                                                            | Los atributos para configurar el contexto del lienzo WebGL.                                                                                                                                                                                                                                                                                                                                                                                                    |
| dispositivospermitidos [Opcional]                                                                                 | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device) | `XR8.XrConfig.device().MOBILE_AND_HEADSETS`                                                                                      | Especifique la clase de dispositivos en los que debe ejecutarse la canalización.  Si el dispositivo actual no pertenece a esa clase, la ejecución fallará antes de abrir la cámara. Si allowedDevices es `XR8.XrConfig.device().ANY`, abre siempre la cámara. Ten en cuenta que el seguimiento mundial sólo puede utilizarse con `XR8.XrConfig.device().MOBILE_AND_HEADSETS` o `XR8.XrConfig.device().MOBILE`. |
| sessionConfiguration: `{disableXrTablet, xrTabletStartsMinimized, defaultEnvironment}` [Opcional] | Objeto                                                 | `{}`                                                                                                                             | Configure las opciones relacionadas con los distintos tipos de sesiones.                                                                                                                                                                                                                                                                                                                                                                                       |

`sessionConfiguration` es un objeto con las siguientes propiedades [Opcionales]:

| Propiedad                                                                                                                                                                                            | Tipo     | Por defecto | Descripción                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| disableXrTablet [Opcional]                                                                                                                       | Booleano | `false`     | Desactiva la tableta visible en sesiones inmersivas.                                      |
| xrTabletStartsMinimized [Opcional]                                                                                                               | Booleano | `false`     | La tableta se iniciará minimizada.                                                        |
| defaultEnvironment `{disabled, floorScale, floorTexture, floorColor, fogIntensity, skyTopColor, skyBottomColor, skyGradientStrength}` [Opcional] | Objeto   | {}          | Configure las opciones relacionadas con el entorno predeterminado de su sesión inmersiva. |

`defaultEnvironment` es un objeto con las siguientes propiedades [Opcionales]:

| Propiedad                                                                          | Tipo              | Por defecto | Descripción                                                                                   |
| ---------------------------------------------------------------------------------- | ----------------- | ----------- | --------------------------------------------------------------------------------------------- |
| desactivado [Opcional]         | Booleano          | `false`     | Desactiva el fondo "espacio vacío" por defecto.                               |
| floorScale [Opcional]          | `Número`          | `1`         | Reducir o aumentar la textura del suelo.                                      |
| floorTexture [Opcional]        | Activo            |             | Especifique un activo de textura alternativo o URL para el suelo de baldosas. |
| floorColor [Opcional]          | Color hexadecimal | `#1A1C2A`   | Establezca el color del suelo.                                                |
| fogIntensity [Opcional]        | `Número`          | `1`         | Aumenta o disminuye la densidad de la niebla.                                 |
| skyTopColor [Opcional]         | Color hexadecimal | `#BDC0D6`   | Establece el color del cielo directamente sobre el usuario.                   |
| skyBottomColor [Opcional]      | Color hexadecimal | `#1A1C2A`   | Establece el color del cielo en el horizonte.                                 |
| skyGradientStrength [Opcional] | `Número`          | `1`         | Controla la nitidez de las transiciones del degradado del cielo.              |

Notas:

- configuración de la cámara: El seguimiento mundial (SLAM) sólo es compatible con la cámara trasera.  Si está utilizando la cámara frontal, debe desactivar el seguimiento mundial llamando primero a XR8.XrController.configure({disableWorldTracking: true})\`.

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
// Abre la cámara y comienza a ejecutar el bucle de ejecución de cámara
// En index.html: <canvas id="camerafeed"></canvas>
XR8.run({canvas: document.getElementById('camerafeed')})
```

## Ejemplo - Uso de la cámara frontal (sólo seguimiento de imagen) {#example---using-front-camera-image-tracking-only}

```javascript
// Desactiva el seguimiento del mundo (SLAM). Esto es necesario para utilizar la cámara frontal.
XR8.XrController.configure({disableWorldTracking: true})
// Abre la cámara y comienza a ejecutar el bucle de ejecución de cámara
// En index.html: <canvas id="camerafeed"></canvas>
XR8.run({canvas: document.getElementById('camerafeed'), cameraConfig: {dirección: XR8.XrConfig.camera().FRONT}})
```

## Ejemplo - Establecer glContextConfig {#example---set-glcontextconfig}

```javascript
// Abre la cámara y comienza a ejecutar el bucle de ejecución de la cámara con un lienzo opaco.
// En index.html: <canvas id="camerafeed"></canvas>
XR8.run({canvas: document.getElementById('camerafeed'), glContextConfig: {alpha: false, preserveDrawingBuffer: false}})
```
