# Primeros pasos con PlayCanvas

Para empezar, vaya a <https://playcanvas.com/user/the8thwall> y bifurque un proyecto de ejemplo:

- Proyectos de muestra del kit de inicio
  - [Kit de iniciación al seguimiento de imágenes](https://playcanvas.com/project/631721/overview/8th-wall-ar-image-targets): Una aplicación para empezar a crear rápidamente aplicaciones de seguimiento de imágenes en PlayCanvas.
  - [Kit de iniciación al seguimiento mundial](https://playcanvas.com/project/631719/overview/8th-wall-ar-world-tracking): Una aplicación para empezar a crear rápidamente aplicaciones de seguimiento del mundo en PlayCanvas.
  - [Kit de inicio de efectos faciales](https://playcanvas.com/project/687674/overview/8th-wall-ar-face-effects): Una aplicación para empezar a crear rápidamente aplicaciones de Efectos Faciales en PlayCanvas.
  - [Kit de iniciación a los efectos del cielo](https://playcanvas.com/project/1055775/overview/8th-wall-sky-effects): Una aplicación para empezar a crear rápidamente aplicaciones de Sky Effects en PlayCanvas.
  - [Kit de inicio de seguimiento de manos](https://playcanvas.com/project/1115012/overview/8th-wall-ar-hand-tracking): Una aplicación para empezar a crear rápidamente aplicaciones de Hand Tracking en PlayCanvas.
  - [Kit de inicio de seguimiento del oído](https://playcanvas.com/project/1158433/overview/8th-wall-ears):  Una aplicación para empezar a crear rápidamente aplicaciones de Ear Tracking en PlayCanvas.

- Otros ejemplos de proyectos
  - [Seguimiento mundial y efectos faciales](https://playcanvas.com/project/701392/overview/8th-wall-ar-swap-camera): Un ejemplo que ilustra cómo cambiar entre Seguimiento del mundo y Efectos faciales en un mismo proyecto.
  - [Cambio de color](https://playcanvas.com/project/783654/overview/8th-wall-ar-color-swap).: Una aplicación para empezar a crear rápidamente aplicaciones de seguimiento del mundo AR que incluyen UI simple y cambio de color.
  - [Swap Scenes](https://playcanvas.com/project/781435/overview/8th-wall-ar-swap-scenes).: Una aplicación para empezar a crear rápidamente aplicaciones AR World Tracking que intercambian escenas.
  - [Intercambiar cámara](https://playcanvas.com/project/701392/overview/8th-wall-ar-swap-camera): Una aplicación que demuestra cómo cambiar entre los Efectos de Cara de la cámara frontal y el Seguimiento del Mundo de la cámara trasera.

## Añada su App Key {#add-your-app-key}

Vaya a Configuración -> Scripts externos

Deben añadirse los dos guiones siguientes:

- `https://cdn.8thwall.com/web/xrextras/xrextras.js`
- `https://apps.8thwall.com/xrweb?appKey=XXXXXX`

A continuación, sustituya `XXXXXX` por su propia App Key exclusiva obtenida de la 8ª consola mural.

## Activar "Lienzo transparente" {#enable-transparent-canvas}

1. Vaya a Configuración -> Renderizado.
2. Asegúrese de que la opción "Lienzo transparente" está **marcada**.

## Desactivar "Preferir WebGL 2.0" {#disable-prefer-webgl-20}

1. Vaya a Configuración -> Renderizado.
2. Asegúrate de que la opción "Prefer WebGL 2.0" está **desmarcada**.

## Añadir xrcontroller.js {#add-xrcontroller}

Los proyectos PlayCanvas de ejemplo de 8th Wall se rellenan con un objeto de juego XRController. Si estás empezando con un proyecto en blanco, descarga `xrcontroller.js` de <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> y adjúntalo a una Entidad en tu escena.

**NOTA**: Sólo para proyectos SLAM y/o Image Target. No se pueden utilizar simultáneamente `xrcontroller.js` y `facecontroller.js` o
`layerscontroller.js`.

| Opción               | Descripción                                                                                                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disableWorldTracking | Si es true, desactiva el seguimiento SLAM por eficiencia.                                                                                                                                                                                           |
| shadowmaterial       | Material que desea utilizar como receptor de sombras transparentes (por ejemplo, para las sombras del suelo). Normalmente, este material se utiliza en un plano de tierra situado en (0,0,0). |

## Añadir layerscontroller.js {#add-layerscontroller}

Los proyectos PlayCanvas de ejemplo de 8th Wall se rellenan con un objeto de juego FaceController. Si estás empezando con un proyecto en blanco, descarga `layerscontroller.js` de <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> y adjúntalo a una Entidad en tu escena.

**NOTA**: Sólo para proyectos de Sky Effects. No se pueden utilizar simultáneamente `layerscontroller.js` y `facecontroller.js` o
`xrcontroller.js`.

## Añadir facecontroller.js {#add-facecontroller}

Los proyectos PlayCanvas de ejemplo de 8th Wall se rellenan con un objeto de juego FaceController. Si estás empezando con un proyecto en blanco, descarga `facecontroller.js` de <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> y adjúntalo a una Entidad en tu escena.

**NOTA**: Sólo para proyectos de efectos faciales. No se pueden utilizar simultáneamente `facecontroller.js` y `xrcontroller.js` o
`layerscontroller.js` o `handcontroller.js`.

| Opción     | Descripción                                                                         |
| ---------- | ----------------------------------------------------------------------------------- |
| headAnchor | La entidad a anclar a la raíz de la cabeza en el espacio del mundo. |

## Añadir handcontroller.js {#add-handcontroller}

Los proyectos PlayCanvas de ejemplo de 8th Wall se rellenan con un objeto de juego HandController. Si estás empezando con un proyecto en blanco, descarga `handcontroller.js` de <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> y adjúntalo a una Entidad en tu escena.

**NOTA**: Sólo para proyectos de seguimiento manual. No se pueden utilizar simultáneamente `handcontroller.js` y `xrcontroller.js` o
`layerscontroller.js` o `facecontroller.js`.

| Opción     | Descripción                                                                       |
| ---------- | --------------------------------------------------------------------------------- |
| handAnchor | La entidad a anclar a la raíz de la mano en el espacio del mundo. |
