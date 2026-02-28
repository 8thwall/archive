# XR8.AFrame

A-Frame (<https://aframe.io>) es un framework web diseñado para construir experiencias de realidad virtual. Añadiendo 8th Wall Web a tu proyecto A-Frame, ahora puede construir fácilmente experiencias de **realidad aumentada** para la web.

## Añadir 8th Wall Web a A-Frame {#adding-8th-wall-web-to-a-frame}

#### Editor de la nube {#cloud-editor}

1. Oólo tiene que añadir una etiqueta "meta" en head.html para incluir la biblioteca "8-Frame" en su proyecto. Si está clonando de alguna de las plantillas basadas en A-Frame de 8th Wall o de proyectos autoalojados, ya estará ahí.  Además, no es necesario añadir manualmente su AppKey.

`<meta name="8thwall:renderer" content="aframe:1.4.1">`

#### Autohospedaje {#self-hosted}

8th Wall Web puede añadirse a tu proyecto A-Frame en unos sencillos pasos:

1. Incluye una versión ligeramente modificada de A-Frame (denominada "8-Frame") que soluciona algunos problemas de pulido:

`<script src="//cdn.8thwall.com/web/aframe/8frame-1.4.1.min.js"></script>`

2. Añada la siguiente etiqueta script al HEAD de su página. Sustituya las X por la clave de su aplicación:

`<script src="//apps.8thwall.com/xrweb?appKey=XXXXX"></script>`

## Configurar la cámara: `xrconfig` {#configuring-the-camera}

Para configurar la alimentación de la cámara, añada el componente `xrconfig` a su `a-scene`:

`<a-scene xrconfig>`

#### atributos de xrconfig (todos opcionales) {#xrconfig-attributes}

| Componente                            | Tipo              | Por defecto               | Descripción                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------- | ----------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| cameraDirection                       | `Cadena`          | `'atrás'`                 | Cámara que desea utilizar. Elija entre: `atrás` o `frente`. Utilice `cameraDirection: front;` con `mirroredDisplay: true;` para el modo selfie. Tenga en cuenta que el seguimiento del mundo sólo es compatible con `cameraDirection: back;`.`                                                                                      |
| allowedDevices                        | `Cadena`          | `'móviles y auriculares'` | Clases de dispositivos compatibles. Elija entre: `'móvil-y-auriculares'`, `'móvil'` o `'cualquiera'`. Utilize `'any'` para habilitar dispositivos tipo ordenador portátil o de sobremesa con webcams incorporadas o conectadas. Tenga en cuenta que el seguimiento mundial sólo es compatible con `'móvil-y-auriculares'` o `móvil`. |
| mirroredDisplay                       | `Booleano`        | `false`                   | Si es verdadero, voltea a izquierda y derecha en la geometría de salida e invierte la dirección de la alimentación de la cámara. Utilice `'mirroredDisplay: true;'` con `'cameraDirection: front;'` para el modo selfie. No debe activarse si está activado el Seguimiento Mundial (SLAM).                                           |
| disableXrTablet                       | `Booleano`        | `false`                   | Desactiva la tableta visible en las sesiones inmersivas.                                                                                                                                                                                                                                                                             |
| xrTabletStartsMinimized               | `Booleano`        | `false`                   | La tableta se iniciará minimizada.                                                                                                                                                                                                                                                                                                   |
| disableDefaultEnvironment             | `Booleano`        | `false`                   | Desactiva el fondo por defecto "espacio vacío".                                                                                                                                                                                                                                                                                      |
| disableDesktopCameraControls          | `Booleano`        | `false`                   | Desactiva WASD y la búsqueda de la cámara con el ratón.                                                                                                                                                                                                                                                                              |
| disableDesktopTouchEmulation          | `Booleano`        | `false`                   | Desactiva los toques falsos en el escritorio.                                                                                                                                                                                                                                                                                        |
| disableXrTouchEmulation               | `Booleano`        | `false`                   | No emite eventos táctiles basados en emisiones de rayos del controlador con la escena.                                                                                                                                                                                                                                               |
| disableCameraReparenting              | `Booleano`        | `false`                   | Desactivar cámara -> movimiento objeto controlador                                                                                                                                                                                                                                                                                   |
| defaultEnvironmentFloorScale          | `Número`          | `1`                       | Reduce o aumenta la textura del suelo.                                                                                                                                                                                                                                                                                               |
| defaultEnvironmentFloorTexture        | Activos           |                           | Especifica un activo de textura alternativo o una URL para el suelo de baldosas.                                                                                                                                                                                                                                                     |
| defaultEnvironmentFloorColor          | Color hexadecimal | `#1A1C2A`                 | Establece el color del suelo.                                                                                                                                                                                                                                                                                                        |
| defaultEnvironmentFogIntensity        | `Número`          | `1`                       | Aumenta o disminuye la densidad de la niebla.                                                                                                                                                                                                                                                                                        |
| defaultEnvironmentSkyTopColor         | Color hexadecimal | `#BDC0D6`                 | Establece el color del cielo directamente sobre el usuario.                                                                                                                                                                                                                                                                          |
| defaultEnvironmentSkyBottomColor      | Color hexadecimal | `#1A1C2A`                 | Fija el color del cielo en el horizonte.                                                                                                                                                                                                                                                                                             |
| defaultEnvironmentSkyGradientStrength | `Número`          | `1`                       | Controla la nitidez de las transiciones del degradado del cielo.                                                                                                                                                                                                                                                                     |

Nota:

* `cameraDirection`: Cuando se utiliza `xrweb` para proporcionar seguimiento del mundo (SLAM), sólo se admite la cámara `trasera`. Si utiliza la cámara `frontal` , debes desactivar el seguimiento mundial configurando `disableWorldTracking: true` en `xrweb`.

## Rastreo de Mundos, Objetivos de Imagen y/o VPS de Buque Faro: `xrweb` {#world-tracking-image-targets-andor-lightship-vps}

Si quiere objetivos de imagen de seguimiento del mundo, o VPS de la nave ligera, añade el componente `xrweb` a tu `a-scene`:

`<a-scene xrconfig xrweb>`

#### atributos xrweb (todos opcionales) {#xrweb-attributes}

| Componente           | Tipo       | Por defecto   | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------- | ---------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| scale                | `Cadena`   | `'receptivo'` | O bien `'receptivo'` o `'absoluto'`. `'receptivo'` devolverá valores para que la cámara en el fotograma 1 esté en el origen definido mediante [`XR8.XrController.updateCameraProjectionMatrix()`](../xrcontroller/updatecameraprojectionmatrix). `'absoluto'` devolverá la cámara, los objetivos de imagen, etc. en metros. El valor por defecto es `'receptivo'`. Si se utiliza `'absoluta'`, la posición x, la posición z y la rotación de la pose inicial respetarán los parámetros establecidos en [`XR8.XrController.updateCameraProjectionMatrix()`](../xrcontroller/updatecameraprojectionmatrix) una vez estimada la escala. La posición y dependerá de la altura física de la cámara desde el plano del suelo. |
| disableWorldTracking | `Booleano` | `false`       | Si es verdadero, desactive el seguimiento SLAM por eficiencia.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| enableVps            | `Booleano` | `false`       | Si es cierto, busque Ubicaciones de proyecto y una malla. La malla que se devuelve no tiene relación con las Ubicaciones del Proyecto y se devolverá incluso si no hay ninguna Ubicación del Proyecto configurada. Activar VPS anula los ajustes de `scale` y `disableWorldTracking`.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| proyectoWayspots     | `Matriz`   | `[]`          | Cadenas separadas por comas de nombres de ubicaciones de proyectos con los que localizar exclusivamente. Si no se establece o se pasa una cadena vacía, localizaremos todas las ubicaciones de proyecto cercanas.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

Notas:

* `xrweb` y `xrface` no pueden utilizarse al mismo tiempo.
* `xrweb` y `xrlayers` pueden utilizarse al mismo tiempo. Debes utilizar `xrconfig` al hacerlo.
  * La mejor práctica es utilizar siempre `xrconfig`; sin embargo, si utiliza `xrweb` sin `xrface` o `xrlayers` o `xrconfig`, se añadirá automáticamente `xrconfig`.  Cuando esto ocurra, todos los atributos de que se hayan establecido en `xrweb` se pasarán a `xrconfig`.
* `cameraDirection`: El seguimiento mundial (SLAM) sólo es compatible con la cámara `trasera`. Si utiliza la cámara `frontal`, debe desactivar el seguimiento del mundo configurando `disableWorldTracking: true`.
* El seguimiento mundial (SLAM) sólo es compatible con los dispositivos móviles.

## Efectos del cielo: `xrlayers` y `xrlayerscene` {#sky-effects-xrlayers-and-xrlayerscene}

Si quiere Efectos del cielo:

1. Añada el componente `xrlayers` a su `a-scene`
2. Añada el componente `xrlayerscene` a una `a-entity` y añada contenido que quieras que esté en el cielo bajo esa `a-entity`.

```html
<a-scene xrconfig xrlayers>
  <a-entity xrlayerscene="name: sky; edgeSmoothness:0.6; invertLayerMask: true;">
    <!-- Añada aquí tsu contenido de Efectos Cielo. -->
  </a-entity>
</a-scene>
```

#### atributos de xrlayers {#xrlayers-attributes}

Ninguno

Notas:

* `xrlayers` y `xrface` no pueden utilizarse al mismo tiempo.
* `xrlayers` y `xrweb` pueden utilizarse al mismo tiempo. Debes utilizar `xrconfig` al hacerlo.
  * La mejor práctica es utilizar siempre `xrconfig`; sin embargo, si utiliza `xrlayers` sin `xrface` o `xrweb` o `xrconfig`, entonces `xrconfig` se añadirá automáticamente. Cuando esto ocurra, todos los atributos que se hayan establecido en `xrweb` se pasarán a `xrconfig`.

#### atributos de xrlayerscene {#xrlayerscene-attributes}

| Componente      | Tipo       | Por defecto | Descripción                                                                                                                                                                        |
| --------------- | ---------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name            | `Cadena`   | `''`        | El nombre de la capa. Debe corresponder a una capa de [`XR8.LayersController`](../layerscontroller/layerscontroller.md). La única capa compatible en este momento es `sky`.        |
| invertLayerMask | `Booleano` | `false`     | Si es verdadero, el contenido que coloque en su escena ocluirá las zonas que no estén en el cielo. Si es falso, el contenido que coloque en su escena ocluirá las zonas del cielo. |
| edgeSmoothness  | `Número`   | `0`         | Cantidad para alisar los bordes de la capa. Valores válidos entre 0-1.                                                                                                             |

## Efectos faciales: `xrface` {#face-effects}

Si quiere el seguimiento de Efectos faciales, añade el componente `xrface` a su `a-scene`:

`xrconfig xrface>`

#### atributos de xrface {#xrface-attributes}

| Componente               | Tipo      | Por defecto                            | Descripción                                                                                                                                                                                       |
| ------------------------ | --------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| meshGeometry             | `Matriz`  | `['cara']`                             | Cadenas separadas por comas que configuran qué partes de la malla de caras tendrán índices de triángulos devueltos. Puede ser cualquier combinación de `"cara"`, `"ojos"`, `"iris"` y/o `"boca"`. |
| maxDetections [Optional] | `Number`  | `1`                                    | El número máximo de caras a detectar. Las opciones disponibles son 1, 2 ó 3.                                                                                                                      |
| uvType [Opcional]        | `Cadena`  | `[XR8.FaceController.UvType.STANDARD]` | Especifique qué uvs se devuelven en el evento de escaneo de caras y carga de caras. Las opciones son: `[XR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`                 |
| enableEars [opcional]    | `Boolean` | `false`                                | Si es true, ejecuta la detección de orejas simultáneamente con los efectos faciales y devuelve los puntos de fijación de las orejas.                                                              |


Notas:

* `xrface` y `xrweb` no pueden utilizarse al mismo tiempo.
* `xrface` y `xrlayers` no pueden utilizarse al mismo tiempo.
* La práctica recomendada es utilizar siempre `xrconfig`; sin embargo, si utiliza `xrface` sin `xrconfig`, `xrconfig` se agregará automáticamente. Cuando esto ocurra, todos los atributos que se establecieron en `xrface` se pasarán a `xrconfig`.

## Seguimiento de la mano: `xrhand` {#hand-tracking}

Si quiere el Seguimiento de Manos, añada el componente `xrhand` a su `a-scene`:

`<a-scene xrconfig xrhand>`

#### atributos xrhand {#xrhand-attributes}

| Componente              | Tipo       | Por defecto | Descripción                                                                                                                                      |
| ----------------------- | ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| enableWrists [Opcional] | `Booleano` | `false`     | Si es verdadero, ejecuta la detección de la muñeca simultáneamente con el seguimiento de la mano y devuelve los puntos de fijación de la muñeca. |

Ninguno

Notas:

* `xrhand` y `xrweb` no pueden utilizarse al mismo tiempo.
* `xrhand` y `xrlayers` no pueden utilizarse al mismo tiempo.
* `xrhand` y `xrface` no pueden utilizarse al mismo tiempo.

## Funciones {#functions}

| Función                                           | Descripción                                                                                                                                                                                  |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xrconfigComponent](xrconfigcomponent.md)         | Cre un componente A-Frame para configurar la cámara que se puede registrar con `AFRAME.registerComponent()`. No suele ser necesario llamarlo directamente.                                   |
| [xrwebComponent](xrwebcomponent.md)               | Crea un componente A-Frame para el seguimiento del mundo y/o del objetivo de la imagen que puede registrarse con `AFRAME.registerComponent()`. No suele ser necesario llamarlo directamente. |
| [xrlayersComponent](xrlayerscomponent.md)         | Crea un componente A-Frame para el seguimiento de capas que se puede registrar con `AFRAME.registerComponent()`. No suele ser necesario llamarlo directamente.                               |
| [xrfaceComponent](xrfacecomponent.md)             | Crea un componente A-Frame para el seguimiento de Efectos faciales que se puede registrar con `AFRAME.registerComponent()`. Generalmente no será necesario llamarlos directamente.           |
| [xrlayersceneComponent](xrlayerscenecomponent.md) | Crea un componente A-Frame para una escena Layer que se puede registrar con `AFRAME.registerComponent()`. Generalmente no será necesario llamarlos directamente.                             |

#### Ejemplo - SLAM activado (por defecto) {#example---slam-enabled-default}

```html
<a-scene xrconfig xrweb>
```

#### Ejemplo - SLAM desactivado (sólo seguimiento de imagen) {#example---slam-disabled-image-tracking-only}

```html
<a-scene xrconfig xrweb="disableWorldTracking: true">
```

#### Ejemplo - Activar VPS {#example---enable-vps}

```html
<a-scene xrconfig xrweb="enableVps: true; projectWayspots=ubicación1,ubicación2,ubicación3">
```

#### Ejemplo - Cámara frontal (sólo seguimiento de imagen) {#example---front-camera-image-tracking-only}

```html
<a-scene xrconfig="cameraDirection: front" xrweb="disableWorldTracking: true">
```

#### Ejemplo - Cámara frontal Efectos del cielo {#example---front-camera-sky-effects}

```html
<a-scene xrconfig="cameraDirection: front" xrlayers>
```

#### Ejemplo - Cielo + SLAM {#example---sky--slam}

```html
<a-scene xrconfig xrweb xrlayers>
  <a-entity xrlayerscene="name: sky; edgeSmoothness:0.6; invertLayerMask: true;">
    <!-- Añada aquí su contenido de Efectos Cielo. -->
  </a-entity>
</a-scene>
```

#### Ejemplo - Efectos faciales {#example---face-effects}

```html
xrconfig xrface>
```

#### Ejemplo: Efectos faciales con orejas {#example---face-effects-ears}

```html
<a-scene xrconfig xrface="enableEars:true">
```

#### Ejemplo - Seguimiento manual {#example---hand-tracking}

```html
<a-scene xrconfig xrhand>
```
