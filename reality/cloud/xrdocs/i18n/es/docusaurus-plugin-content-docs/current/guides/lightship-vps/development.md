---
sidebar_label: Development
sidebar_position: 4
---

# Developing VPS Experiences

## Habilitación del Lightship VPS{#enabling-lightship-vps}

Para activar el VPS en su proyecto WebAR, tendrá que establecer `enableVPS` en `true`.

Para los proyectos A-Frame, establezca `enableVps: true` en el componente `xrweb` en la página `<a-scene>`

En los proyectos que sin AFrame establezca `enableVps: true` en la llamada a `XR8.XrController.configure()` antes de
arrancar el motor.

#### Ejemplo - AFrame {#example---aframe}

```html
<a-scene
  coaching-overlay
  landing-page
  xrextras-loading
  xrextras-runtime-error
  ...
  xrweb="enableVps: true;">
```

#### Ejemplo - Sin AFrame {#example---non-aframe}

```javascript
XR8.XrController.configure({enableVps: true})
// A continuación, arranque el motor de 8th Wall
```

## Desarrollo de experiencias VPS a medida

Las escenas VPS a medida están diseñadas para una única ubicación y utilizan una malla de referencia del navegador geoespacial para alinear el contenido de RA.

Parte 1: Añadir ubicación a la escena

1. Abra el navegador geoespacial (icono de mapa 🗺 a la izquierda)
2. Encuentre una ubicación activada por VPS (o [nomine/active la suya](https://www.8thwall.com/docs/web/#scanning-wayspots))
3. Añadir la ubicación al proyecto

![](https://static.8thwall.app/assets/geospatial-browser-jmcd7ic3ob.png)

Parte 2: Utilizar Location GLB como referencia para una animación AR personalizada

4. Descargue el GLB de referencia de la parte derecha de la fila.
5. Use esto en su software de modelado 3D (Blender, Maya, A-Frame, etc) para posicionar el contenido AR relativo al origen de la malla.

![](https://i.giphy.com/media/dOFnRHGzZghGjecdeq/giphy.gif)

\*IMPORTANTE El origen de este modelo 3D es el origen de la Localización. NO RESTABLEZCA EL ORIGEN O SU CONTENIDO NO ESTARÁ ALINEADO.

_OPCIONALMENTE_: Si la malla descargada del navegador geoespacial no tiene la calidad suficiente para utilizarla en una animación, física u oclusor,
puede considerar realizar un escaneado con una aplicación de terceros como Scaniverse y alinear esa malla de alta calidad con la descargada del navegador geoespacial
.

6. Importar animación GLB en Cloud Editor y añadir a escena
7. Añada el componente named-location a la página `<a-entity>` de su activo. El atributo "name" se refiere al "nombre" de la ubicación del proyecto en el navegador geoespacial.

¡Tachán! 🪄 Tu animación debe aparecer alineada con la Localización en el mundo real.

Parte 3: Añadir oclusión y sombras

1. En tu escena, añade `<a-entity named-location="name: LOCATIONNAME"><a-entity>`
2. Añade tres `<a-entity>` dentro de este elemento como sus hijos. Estas serán tu malla oclusora, malla sombra y animación VPS.
3. En el primer `<a-entity>`, añade `xrextras-hider-material` y `gltf-model="#vps-mesh"`. "`#vps-mesh`" debería referirse
   a una versión de su GLB de referencia a la que se le han eliminado las texturas y se ha diezmado la geometría.
4. En el segundo `<a-entity>`, añade `shadow-shader`, `gltf-model="#vps-mesh"`, y `shadow="cast: false"`.
   El sombreador de sombra aplica un material de sombra a la malla de referencia con un desplazamiento de polígonos para evitar la lucha Z.
   Puedes elegir si quieres que la malla vps proyecte una sombra sobre el mundo real con `shadow="cast: true"`.
5. En el tercer `<a-entity>`, añade `gltf-model="#vps-anim"`, `reflections="type: realtime"`, `play-vps-animation` y `shadow="receive:false"`.
   `play-vps-animation` espera hasta que el `vps-coaching-overlay` haya desaparecido antes de reproducir la animación VPS.

### _Instalación de desarrollo de escritorio remoto_

![](https://i.giphy.com/media/cBr0UnA7jjqAzAOGTi/giphy.gif)

A menudo resulta útil utilizar el inspector de A-Frame para posicionar el contenido de forma remota en el escritorio.
Para configurar la escena de este proyecto para el desarrollo de escritorio remoto, desactive los siguientes componentes
añadiendo una letra al principio (es decir, "Znamed-location"):

- `xrweb` -> `Zxrweb`
- `xrextras-loading` -> `Zxrextras-loading`
- `named-location` -> `Znamed-location`
- `xrextras-hider-material` -> `Zxrextras-hider-material`

Ahora puede abrir el [A-Frame Inspector](https://aframe.io/docs/1.3.0/introduction/visual-inspector-and-dev-tools.html)
(Mac: ctrl + opt + i, PC: ctrl + alt + i) y posicionar el contenido relativo a la malla VPS importada desde el Navegador Geoespacial.
Recuerde: se trata de un _inspector_. Deberá copiar los valores de transformación en su código.

Opcionalmente, puede reposicionar temporalmente el `<a-entity named-location>` al centro de la escena
para ayudar con la velocidad de iteración. NOTA: reajuste `<a-entity named-location>` a `position="0 0 0"` para asegurarse de que el contenido de VPS
se alinea correctamente.

### _Instalación de desarrollo móvil remoto_

![](https://i.giphy.com/media/ZVQCdOhIHx10Dsrxnf/giphy.gif)

A menudo es útil utilizar el inspector A-Frame para simular VPS de forma remota en su dispositivo móvil.
Para configurar la escena de este proyecto para el desarrollo móvil remoto, desactive los siguientes componentes
añadiendo una letra al principio (es decir, "Znamed-location"):

- `named-location` -> `Znamed-location`
- `xrextras-hider-material` -> `Zxrextras-hider-material`

A continuación, tendrá que desactivar VPS y activar la escala absoluta. Esto garantizará que la malla de referencia
tenga el tamaño correcto para una simulación precisa:

`xrweb="enableVps: false; scale: absolute;"`

Debe reposicionar temporalmente el `<a-entity named-location>` al centro de la escena
para ayudar con la velocidad de iteración. Intenta alinear la base de tu malla de referencia con `y="0"` (el suelo).
NOTE: Before deploying your VPS project, reset `<a-entity named-location>` to `position="0 0 0"`
to ensure VPS content is aligned correctly.

## Desarrollo de experiencias VPS procedimentales

Las escenas VPS procedimentales están diseñadas para utilizar cualquier Ubicación detectada (en contraposición a Ubicaciones de Proyecto específicas). Una vez detectada, la malla de la Ubicación
está a su disposición para generar experiencias VPS generadas procedimentalmente.

El motor de 8th Wall emite dos eventos relacionados con el procedimiento:

- [xrmeshfound](https://www.8thwall.com/docs/web/#xrmeshfound): se emite cuando se encuentra una malla por primera vez, ya sea después del inicio o después de un recenter()
- [xrmeshlost](https://www.8thwall.com/docs/web/#xrmeshlost): emitido cuando se llama a recenter().

Después de detectar una malla, el motor de 8th Wall continuará rastreando contra esa malla hasta que se llame a recenter().
