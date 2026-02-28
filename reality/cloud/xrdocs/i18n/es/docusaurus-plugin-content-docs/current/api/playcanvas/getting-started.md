# Primeros pasos con PlayCanvas

Para empezar, vaya a <https://playcanvas.com/user/the8thwall> y bifurque un proyecto de ejemplo:

* Proyectos de muestra del kit de inicio
  * [Kit de inicio de seguimiento de imágenes](https://playcanvas.com/project/631721/overview/8th-wall-ar-image-targets): Una aplicación para empezar a crear rápidamente aplicaciones de seguimiento de imágenes en PlayCanvas.
  * [Kit de inicio de seguimiento del mundo](https://playcanvas.com/project/631719/overview/8th-wall-ar-world-tracking): Una aplicación para empezar a crear rápidamente aplicaciones de seguimiento del mundo en PlayCanvas.
  * [Kit de inicio de efectos faciales](https://playcanvas.com/project/687674/overview/8th-wall-ar-face-effects): Una aplicación para empezar a crear rápidamente aplicaciones de Efectos Faciales en PlayCanvas.
  * [Kit de inicio de Efectos Cielo](https://playcanvas.com/project/1055775/overview/8th-wall-sky-effects): Una aplicación para empezar a crear rápidamente aplicaciones de Efectos Cielo en PlayCanvas.
  * [Kit de inicio de seguimiento de manos](https://playcanvas.com/project/1115012/overview/8th-wall-ar-hand-tracking): Una aplicación para empezar a crear rápidamente aplicaciones de Seguimiento de Manos en PlayCanvas.
  * [Ear Tracking Starter Kit](https://playcanvas.com/project/1158433/overview/8th-wall-ears): Una aplicación para empezar a crear rápidamente aplicaciones de seguimiento de orejas en PlayCanvas.


* Ejemplos de proyectos adicionales
  * [Seguimiento global y Efectos faciales](https://playcanvas.com/project/701392/overview/8th-wall-ar-swap-camera): Un ejemplo que ilustra cómo cambiar entre Seguimiento del mundo y Efectos faciales en un mismo proyecto.
  * [Cambio de color](https://playcanvas.com/project/783654/overview/8th-wall-ar-color-swap): Una aplicación para empezar a crear rápidamente aplicaciones de seguimiento del mundo de AR que incluyan una interfaz de usuario sencilla y cambio de color.
  * [Intercambiar Escenas](https://playcanvas.com/project/781435/overview/8th-wall-ar-swap-scenes): Una aplicación para empezar a crear rápidamente aplicaciones de Seguimiento del Mundo de AR que cambian de escena.
  * [Cambiar de Cámara](https://playcanvas.com/project/701392/overview/8th-wall-ar-swap-camera): Una aplicación que demuestra cómo cambiar entre los Efectos Faciales de la cámara frontal y el Seguimiento Mundial de la cámara trasera.

## Añadir su App Key {#add-your-app-key}

Vaya a Configuración -> Scripts externos

Hay que añadir los dos guiones siguientes:

* `https://cdn.8thwall.com/web/xrextras/xrextras.js`
* `https://apps.8thwall.com/xrweb?appKey=XXXXXX`

A continuación, sustituya `XXXXXX` por su propia App Key exclusiva obtenida de la Consola de 8th Wall.

## Activar "Lienzo transparente" {#enable-transparent-canvas}

1. Vaya a Ajustes -> Renderizado.
2. Asegúrese de que la opción "Lienzo transparente" está **marcada**.

## Desactive "Preferir WebGL 2.00". {#disable-prefer-webgl-20}

1. Vaya a Ajustes -> Renderizado.
2. Asegúraese de que la opción "Prefer WebGL 2.00" está **desmarcada**.

## Añada xrcontroller.js {#add-xrcontroller}
Los proyectos PlayCanvas de muestra de 8th Wall se rellenan con un objeto de juego XRController. Si empieza con un proyecto en blanco, descargue `xrcontroller.js` de <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> y adjúntelo a una Entidad de su escena.

**NOTA**: Solo para proyectos SLAM y/o Objetivo Imagen. `xrcontroller.js` y `facecontroller.js` o `layerscontroller.js` no pueden utilizarse simultáneamente.

| Opción               | Descripción                                                                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| disableWorldTracking | Si es verdadero, desactive el seguimiento SLAM por eficiencia.                                                                                                                                         |
| shadowmaterial       | Material que quiere utilizar como receptor de sombras transparentes (por ejemplo, para las sombras del suelo). Normalmente este material se utilizará en una entidad plana "tierra" situada en (0,0,0) |

## Añadir layerscontroller.js {#add-layerscontroller}
Los proyectos PlayCanvas de muestra de 8th Wall se rellenan con un objeto de juego FaceController. Si empieza con un proyecto en blanco, descargue `layerscontroller.js` de <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> y adjúntelo a una Entidad de su escena.

**NOTA**: Solo para proyectos de Efectos Cielo. `layerscontroller.js` y `facecontroller.js` o `xrcontroller.js` no pueden utilizarse simultáneamente.

## Añadir facecontroller.js {#add-facecontroller}
Los proyectos PlayCanvas de muestra de 8th Wall se rellenan con un objeto de juego FaceController. Si empieza con un proyecto en blanco, descargue `facecontroller.js` de <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> y adjúntelo a una Entidad de su escena.

**NOTA**: Solo para proyectos de Efectos Faciales. `facecontroller.js` y `xrcontroller.js` o `layerscontroller.js` o `handcontroller.js` no pueden utilizarse simultáneamente.

| Opción     | Descripción                                                            |
| ---------- | ---------------------------------------------------------------------- |
| headAnchor | La entidad para anclar a la raíz de la cabeza en el espacio del mundo. |

## Añadir handcontroller.js {#add-handcontroller}
Los proyectos PlayCanvas de muestra de 8th Wall se rellenan con un objeto de juego HandController. Si empieza con un proyecto en blanco, descarga `handcontroller.js` de <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> y adjúntelo a una Entidad de su escena.

**NOTA**: Solo para proyectos de Seguimiento Manual. `handcontroller.js` y `xrcontroller.js` o `layerscontroller.js` o `facecontroller.js` no pueden utilizarse simultáneamente.

| Opción     | Descripción                                                          |
| ---------- | -------------------------------------------------------------------- |
| handAnchor | La entidad para anclar a la raíz de la mano en el espacio del mundo. |
