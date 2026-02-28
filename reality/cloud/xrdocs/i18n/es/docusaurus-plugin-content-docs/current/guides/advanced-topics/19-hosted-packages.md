---
id: hosted-packages
---

# Paquetes alojados

## Metaetiquetas {#meta-tags}

Utiliza las etiquetas de 8th Wall `<meta>` para cargar rápidamente renderizadores y paquetes comunes en tu proyecto de editor de nubes.

Utilice el atributo `name` para especificar si está cargando un `renderer` o un `package`, y el atributo `content` para especificar qué renderer/paquete:

```
<meta name="8thwall:renderer" content="renderer:version">
<meta name="8thwall:package" content="@package.package">
```

### Renderizadores {#renderers}

Puedes utilizar la etiqueta `<meta name="8thwall:renderer" ...>` para cargar A-Frame, three.js o Babylon.js en tu proyecto de editor de nubes:

```
<meta name="8thwall:renderer" content="aframe:version">
<meta name="8thwall:renderer" content="threejs:version">
<meta name="8thwall:renderer" content="babylonjs:version">
```

#### aframe {#aframe}

Sólo algunas versiones de A-Frame son compatibles con la etiqueta `<meta>`. Esto se debe a que 8th Wall utiliza una versión personalizada de A-Frame que introduce varias mejoras para soportar mejor la RA.

- `0.8.2`
- `0.9.0`
- `0.9.2`
- `1.0.3`
- `1.0.4`
- `1.1.0`
- `1.2.0`
- `1.3.0`
- `1.4.1`
- `1.5.0`

##### Ejemplo {#example}

```
<meta name="8thwall:renderer" content="aframe:1.5.0">
```

#### tresjs {#threejs}

Todas las versiones de three.js son compatibles a través de la etiqueta `<meta>`.

Tenga en cuenta que three.js 160+ requiere el uso de mapas de importación en lugar de una etiqueta `<meta>`. Véase un ejemplo en [aquí](https://www.8thwall.com/8thwall/placeground-threejs/code/head.html#L8).

##### Ejemplo {#example-1}

```
<meta name="8thwall:renderer" content="threejs:159">
```

### Paquetes {#packages}

Puedes utilizar la etiqueta `<meta name="8thwall:package" ...>` para cargar paquetes comunes en tu proyecto de editor de nubes:

| Paquete                                                                                   | Valor del contenido             |
| ----------------------------------------------------------------------------------------- | ------------------------------- |
| [XRExtras](https://github.com/8thwall/web/tree/master/xrextras)                           | `@8thwall.xrextras`             |
| [Páginas de destino](https://www.8thwall.com/docs/guides/advanced-topics/landing-pages)   | `@8thwall.landing-page`         |
| [Coaching Overlay](https://www.8thwall.com/docs/guides/advanced-topics/coaching-overlays) | `@8thwall.coaching-overlay`     |
| [Vue](https://www.npmjs.com/package/vue)                                                  | `@vuejs.vue`                    |
| [HoloVideoObject](https://www.8thwall.com/8thwall/mrcs-aframe)                            | `@mrcs.holovideoobject`         |
| [React](https://www.npmjs.com/package/react)                                              | `@react.react`                  |
| [React DOM](https://www.npmjs.com/package/react-dom)                                      | `@react.react-dom`              |
| [React Router DOM](https://www.npmjs.com/package/react-router-dom)                        | `@react.react-router-dom`       |
| [A-Frame Extras](https://www.npmjs.com/package/aframe-extras)                             | `@aframe.aframe-extras`         |
| [Sistema de Física A-Frame](https://www.npmjs.com/package/aframe-physics-system)          | `@aframe.aframe-sistema-fisico` |

#### Ejemplo {#example-2}

```
<meta name="8thwall:package" content="@8thwall.xrextras">
```

Todas las etiquetas `<meta>` anteriores evalúan URLs CDN oficiales. Extraerán la última versión compatible del paquete. Si desea utilizar una versión específica, utilice una etiqueta `<script>` en su lugar.

## 8ª Pared CDN {#8th-wall-cdn}

8th Wall aloja una variedad de paquetes fijados a versiones específicas en nuestra CDN para mayor comodidad.

#### munición {#ammo}

- `https://cdn.8thwall.com/web/aframe/ammo.wasm.js`
- `https://cdn.8thwall.com/web/aframe/ammo.wasm.wasm`

#### aframe-sistema-físico {#aframe-physics-system}

- `https://cdn.8thwall.com/web/aframe/aframe-physics-system-3.2.0.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-physics-system-4.0.1.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-physics-system-4.0.1-updated.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-physics-system-4.2.2.min.js`

#### aframe-animation-component {#aframe-animation-component}

- `https://cdn.8thwall.com/web/aframe/aframe-animation-component-5.1.2.min.js`

#### aframe-cromakey-material {#aframe-chromakey-material}

- `https://cdn.8thwall.com/web/aframe/aframe-chromakey-material-1.1.1.min.js`

#### aframe-extras {#aframe-extras}

- `https://cdn.8thwall.com/web/aframe/aframe-extras-4.2.0.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-extras-6.1.0.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-extras-6.1.1.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-extras-7.2.0.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-extras-7.2.0.min.js`

#### aframe-particle-system-component {#aframe-particle-system-component}

- `https://cdn.8thwall.com/web/aframe/aframe-particle-system-component-1.1.3.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-particle-system-component-1.1.4.min.js`

#### aframe-spe-particles-component {#aframe-spe-particles-component}

- `https://cdn.8thwall.com/web/aframe/aframe-spe-particles-component.min.js`

#### depthkit {#depthkit}

- `https://cdn.8thwall.com/web/aframe/depthkit-1.0.0.min.js`

#### holovideoobjeto {#holovideoobject}

- `https://cdn.8thwall.com/web/mrcs/holovideoobject-0.2.2.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.2.2.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.2.3.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.2.5.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.1.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.2.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.3.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.4.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.6.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.7.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.4.0.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.5.0.min.js`
