# XR8.AFrame

A-Frame (<https://aframe.io>) es un framework web diseñado para construir experiencias de realidad virtual.
Al añadir 8th Wall Web a tu proyecto A-Frame, ahora puedes crear fácilmente experiencias de **realidad aumentada**
para la web.

## Adición de la 8ª Red de Pared a A-Frame {#adding-8th-wall-web-to-a-frame}

#### Editor en nube {#cloud-editor}

1. Sólo tiene que añadir una etiqueta "meta" en head.html para incluir la biblioteca "8-Frame" en su proyecto. Si está clonando desde cualquiera de las plantillas basadas en A-Frame de 8th Wall o proyectos autoalojados, ya estará ahí.  Además, no es necesario añadir manualmente su AppKey.

`<meta name="8thwall:renderer" content="aframe:1.4.1">`

#### Autoalojado {#self-hosted}

8th Wall Web puede añadirse a su proyecto A-Frame en unos sencillos pasos:

1. Incluye una versión ligeramente modificada de A-Frame (denominada "8-Frame") que soluciona algunos problemas de pulido:

`<script src="//cdn.8thwall.com/web/aframe/8frame-1.4.1.min.js"></script>`

2. Añade la siguiente etiqueta script al HEAD de tu página. Sustituye las X por la clave de tu aplicación:

`<script src="//apps.8thwall.com/xrweb?appKey=XXXXX"></script>`

## Configuración de la cámara: `xrconfig` {#configuring-the-camera}

Para configurar la alimentación de la cámara, añade el componente `xrconfig` a tu `a-scene`:

`<a-scene xrconfig>`

#### xrconfig Atributos (todos opcionales) {#xrconfig-attributes}

| Componente                            | Tipo              | Por defecto           | Descripción                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------- | ----------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cameraDirection                       | Cadena            | `'atrás'`             | Cámara deseada. Elija entre: `back` o `front`. Usa `cameraDirection: front;` con `mirroredDisplay: true;` para el modo selfie. Ten en cuenta que el seguimiento mundial sólo es compatible con `cameraDirection: back;`.                                                                                                   |
| dispositivospermitidos                | Cadena            | Móviles y auriculares | Clases de dispositivos compatibles. Elige entre: `'móvil y auriculares'`, `'móvil'` o `'cualquiera'`. Utiliza "cualquiera" para activar dispositivos portátiles o de sobremesa con cámaras web integradas o conectadas. Ten en cuenta que el seguimiento mundial sólo es compatible con `'móvil y auriculares'` o `móvil`. |
| mirroredDisplay                       | Booleano          | `false`               | Si es true, voltea a izquierda y derecha en la geometría de salida e invierte la dirección de la alimentación de la cámara. Usa `'mirroredDisplay: true;'` con `'cameraDirection: front;'` para el modo selfie. No debe activarse si está activado el Seguimiento Mundial (SLAM).                                                       |
| disableXrTablet                       | Booleano          | `false`               | Desactiva la tableta visible en sesiones inmersivas.                                                                                                                                                                                                                                                                                                                                       |
| xrTabletStartsMinimized               | Booleano          | `false`               | La tableta se iniciará minimizada.                                                                                                                                                                                                                                                                                                                                                         |
| disableDefaultEnvironment             | Booleano          | `false`               | Desactiva el fondo "espacio vacío" por defecto.                                                                                                                                                                                                                                                                                                                                            |
| disableDesktopCameraControls          | Booleano          | `false`               | Desactiva WASD y la búsqueda de la cámara con el ratón.                                                                                                                                                                                                                                                                                                                                    |
| disableDesktopTouchEmulation          | Booleano          | `false`               | Desactiva los toques falsos en el escritorio.                                                                                                                                                                                                                                                                                                                                              |
| disableXrTouchEmulation               | Booleano          | `false`               | No emitir eventos táctiles basados en raycasts del controlador con la escena.                                                                                                                                                                                                                                                                                                              |
| disableCameraReparenting              | Booleano          | `false`               | Desactivar cámara -> movimiento objeto controlador                                                                                                                                                                                                                                                                                                                                                         |
| defaultEnvironmentFloorScale          | `Número`          | `1`                   | Reducir o aumentar la textura del suelo.                                                                                                                                                                                                                                                                                                                                                   |
| defaultEnvironmentFloorTexture        | Activo            |                       | Especifique un activo de textura alternativo o URL para el suelo de baldosas.                                                                                                                                                                                                                                                                                                              |
| defaultEnvironmentFloorColor          | Color hexadecimal | `#1A1C2A`             | Establezca el color del suelo.                                                                                                                                                                                                                                                                                                                                                             |
| defaultEnvironmentFogIntensity        | `Número`          | `1`                   | Aumenta o disminuye la densidad de la niebla.                                                                                                                                                                                                                                                                                                                                              |
| defaultEnvironmentSkyTopColor         | Color hexadecimal | `#BDC0D6`             | Establece el color del cielo directamente sobre el usuario.                                                                                                                                                                                                                                                                                                                                |
| defaultEnvironmentSkyBottomColor      | Color hexadecimal | `#1A1C2A`             | Establece el color del cielo en el horizonte.                                                                                                                                                                                                                                                                                                                                              |
| defaultEnvironmentSkyGradientStrength | `Número`          | `1`                   | Controla la nitidez de las transiciones del degradado del cielo.                                                                                                                                                                                                                                                                                                                           |

Notas:

- Dirección de la cámara: Cuando se utiliza `xrweb` para proporcionar seguimiento mundial (SLAM), sólo se admite la cámara `back`
  . Si utiliza la cámara frontal, debe desactivar el seguimiento del mundo configurando
  `disableWorldTracking: true` en `xrweb`.

## Rastreo de mundos, objetivos de imagen y/o buque faro VPS: `xrweb` {#world-tracking-image-targets-andor-lightship-vps}

Si quieres objetivos de imagen de seguimiento de mundo, o VPS de nave ligera, añade el componente `xrweb` a tu `a-scene`:

`<a-scene xrconfig xrweb>`

#### xrweb Atributos (todos opcionales) {#xrweb-attributes}

| Componente           | Tipo     | Por defecto    | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------- | -------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| escala               | Cadena   | `'responsive'` | O "sensible" o "absoluto". `'responsive'` devolverá valores para que la cámara en el fotograma 1 esté en el origen definido mediante [`XR8.XrController.updateCameraProjectionMatrix()`](../xrcontroller/updatecameraprojectionmatrix). `'absolute'` devolverá la cámara, objetivos de imagen, etc en metros. Por defecto es `'responsive'`. Cuando se utiliza `'absolute'` la posición x, la posición z y la rotación de la pose inicial respetarán los parámetros establecidos en [`XR8.XrController.updateCameraProjectionMatrix()`](../xrcontroller/updatecameraprojectionmatrix) una vez que se ha estimado la escala. La posición y dependerá de la altura física de la cámara desde el plano del suelo. |
| disableWorldTracking | Booleano | `false`        | Si es true, desactiva el seguimiento SLAM por eficiencia.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| enableVps            | Booleano | `false`        | Si es cierto, busque Ubicaciones de proyecto y una malla. La malla que se devuelve no tiene relación con las Ubicaciones del Proyecto y se devolverá incluso si no hay ninguna Ubicación del Proyecto configurada. Activar VPS anula la configuración de `scale` y `disableWorldTracking`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| proyectoWayspots     | `Array`  | `[]`           | Cadenas separadas por comas de nombres de ubicaciones de proyectos con los que localizar exclusivamente. Si no se establece o se pasa una cadena vacía, localizaremos todas las ubicaciones de proyecto cercanas.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

Notas:

- `xrweb` y `xrface` no pueden utilizarse al mismo tiempo.
- `xrweb` y `xrlayers` pueden utilizarse al mismo tiempo. Para ello debe utilizar `xrconfig`.
  - La mejor práctica es utilizar siempre `xrconfig`; sin embargo, si utiliza `xrweb` sin `xrface` o
    `xrlayers` o `xrconfig`, entonces `xrconfig` se añadirá automáticamente. Cuando esto ocurra, todos los atributos de
    que se hayan establecido en `xrweb` se pasarán a `xrconfig`.
- CámaraDirección: El seguimiento mundial (SLAM) sólo es compatible con la cámara trasera. Si estás usando
  la cámara `front`, debes desactivar el seguimiento del mundo configurando `disableWorldTracking: true`.
- El seguimiento mundial (SLAM) sólo es compatible con dispositivos móviles.

## Efectos del cielo: `xrlayers` y `xrlayerscene` {#sky-effects-xrlayers-and-xrlayerscene}

Si quieres Sky Effects:

1. Añade el componente `xrlayers` a tu `a-scene`.
2. Añade el componente `xrlayerscene` a un `a-entity` y añade el contenido que quieras que esté en el cielo bajo ese `a-entity`.

```html
<a-scene xrconfig xrlayers>
  <a-entity xrlayerscene="name: sky; edgeSmoothness:0.6; invertLayerMask: true;">
    <!-- Add your Sky Effects content here. -->
  </a-entity>
</a-scene>
```

#### xrlayers Atributos {#xrlayers-attributes}

Ninguno

Notas:

- `xrlayers` y `xrface` no pueden utilizarse al mismo tiempo.
- `xrlayers` y `xrweb` pueden utilizarse al mismo tiempo. Para ello debe utilizar `xrconfig`.
  - La mejor práctica es utilizar siempre `xrconfig`; sin embargo, si utiliza `xrlayers` sin `xrface` o `xrweb` o `xrconfig`, entonces `xrconfig` se añadirá automáticamente. Cuando esto ocurra, todos los atributos establecidos en `xrweb` se pasarán a `xrconfig`.

#### xrlayerscene Atributos {#xrlayerscene-attributes}

| Componente      | Tipo     | Por defecto | Descripción                                                                                                                                                                                                                 |
| --------------- | -------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nombre          | Cadena   | `''`        | El nombre de la capa. Debe corresponder a una capa de [`XR8.LayersController`](../layerscontroller/layerscontroller.md). La única capa compatible en este momento es `sky`. |
| invertLayerMask | Booleano | `false`     | Si es verdadero, el contenido que coloques en tu escena ocluirá las áreas que no son del cielo. Si es falso, el contenido que coloques en tu escena ocluirá las áreas del cielo.            |
| edgeSmoothness  | `Número` | `0`         | Cantidad para alisar los bordes de la capa. Valores válidos entre 0-1.                                                                                                                      |

## Efectos faciales: `xrface` {#face-effects}

Si desea el seguimiento de los efectos faciales, añada el componente `xrface` a su `a-scene`:

`<a-scene xrconfig xrface>`

#### xrface Atributos {#xrface-attributes}

| Componente                                                                    | Tipo     | Por defecto                            | Descripción                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| meshGeometry                                                                  | `Array`  | `['cara']`                             | Cadenas separadas por comas que configuran qué partes de la malla de caras tendrán índices de triángulo devueltos. Puede ser cualquier combinación de "cara", "ojos", "iris" y/o "boca". |
| maxDetecciones [Opcional] | `Número` | `1`                                    | Número máximo de caras a detectar. Las opciones disponibles son 1, 2 o 3.                                                                                                                |
| uvType [Opcional]         | Cadena   | `[XR8.FaceController.UvType.STANDARD]` | Especifica qué uvs se devuelven en el evento facescanning y faceloading. Las opciones son: `[XR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`.  |
| enableEars [Opcional]     | Booleano | `false`                                | Si es verdadero, ejecuta la detección de orejas simultáneamente con los efectos faciales y devuelve los puntos de fijación de las orejas.                                                                |

Notas:

- `xrface` y `xrweb` no pueden utilizarse al mismo tiempo.
- `xrface` y `xrlayers` no pueden utilizarse al mismo tiempo.
- La mejor práctica es usar siempre `xrconfig`; sin embargo, si usas `xrface` sin `xrconfig` entonces `xrconfig` se añadirá automáticamente. Cuando esto ocurra, todos los atributos que se hayan establecido en `xrface` se pasarán a `xrconfig`.

## Seguimiento de la mano: `xrhand` {#hand-tracking}

Si quieres Hand Tracking, añade el componente `xrhand` a tu `a-scene`:

`<a-scene xrconfig xrhand>`

#### xrhand Atributos {#xrhand-attributes}

| Componente                                                                  | Tipo     | Por defecto | Descripción                                                                                                                                                      |
| --------------------------------------------------------------------------- | -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enableWrists [Opcional] | Booleano | `false`     | Si es verdadero, ejecuta la detección de la muñeca simultáneamente con el seguimiento de la mano y devuelve los puntos de fijación de la muñeca. |

Ninguno

Notas:

- `xrhand` y `xrweb` no pueden utilizarse al mismo tiempo.
- `xrhand` y `xrlayers` no pueden utilizarse al mismo tiempo.
- `xrhand` y `xrface` no pueden utilizarse al mismo tiempo.

## Funciones {#functions}

| Función                                           | Descripción                                                                                                                                                                                                               |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xrconfigComponent](xrconfigcomponent.md)         | Crea un componente A-Frame para configurar la cámara que se puede registrar con `AFRAME.registerComponent()`. Generalmente no será necesario llamarlo directamente.                       |
| [xrwebComponent](xrwebcomponent.md)               | Crea un componente A-Frame para World Tracking y/o Image Target tracking que puede ser registrado con `AFRAME.registerComponent()`. Generalmente no será necesario llamarlo directamente. |
| [xrlayersComponent](xrlayerscomponent.md)         | Crea un componente A-Frame para el seguimiento de capas que puede registrarse con `AFRAME.registerComponent()`. Generalmente no será necesario llamarlo directamente.                     |
| [xrfaceComponent](xrfacecomponent.md)             | Crea un componente A-Frame para el seguimiento de Face Effects que puede registrarse con `AFRAME.registerComponent()`. Generalmente no será necesario llamarlo directamente.              |
| [xrlayersceneComponent](xrlayerscenecomponent.md) | Crea un componente A-Frame para una escena Layer que puede ser registrada con `AFRAME.registerComponent()`. Generalmente no será necesario llamarlo directamente.                         |

#### Ejemplo - SLAM activado (por defecto) {#example---slam-enabled-default}

```html
<a-scene xrconfig xrweb>
```

#### Ejemplo - SLAM desactivado (sólo seguimiento de imágenes) {#example---slam-disabled-image-tracking-only}

```html
<a-scene xrconfig xrweb="disableWorldTracking: true">
```

#### Ejemplo - Habilitar VPS {#example---enable-vps}

```html
<a-scene xrconfig xrweb="enableVps: true; projectWayspots=location1,location2,location3">
```

#### Ejemplo - Cámara frontal (sólo seguimiento de imagen) {#example---front-camera-image-tracking-only}

```html
<a-scene xrconfig="cameraDirection: front" xrweb="disableWorldTracking: true">
```

#### Ejemplo - Cámara frontal Sky Effects {#example---front-camera-sky-effects}

```html
<a-scene xrconfig="cameraDirection: front" xrlayers>
```

#### Ejemplo - Sky + SLAM {#example---sky--slam}

```html
<a-scene xrconfig xrweb xrlayers>
  <a-entity xrlayerscene="name: sky; edgeSmoothness:0.6; invertLayerMask: true;">
    <!-- Add your Sky Effects content here. -->
  </a-entity>
</a-scene>
```

#### Ejemplo - Efectos faciales {#example---face-effects}

```html
<a-scene xrconfig xrface>
```

#### Ejemplo - Efectos faciales con orejas {#example---face-effects-ears}

```html
<a-scene xrconfig xrface="enableEars:true">
```

#### Ejemplo - Seguimiento manual {#example---hand-tracking}

```html
<a-scene xrconfig xrhand>
```
