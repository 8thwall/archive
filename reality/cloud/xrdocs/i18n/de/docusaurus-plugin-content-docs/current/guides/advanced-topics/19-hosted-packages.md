---
id: hosted-packages
---

# Gehostete Pakete

## Meta-Tags {#meta-tags}

Verwenden Sie die 8th Wall `<meta>` Tags, um gängige Renderer und Pakete schnell in Ihr Cloud-Editor-Projekt zu laden.

Verwenden Sie das Attribut "Name", um anzugeben, ob Sie einen "Renderer" oder ein "Paket" laden, und das Attribut "Inhalt", um den Renderer/das Paket anzugeben:

```
<meta name="8thwall:renderer" content="renderer:version">
<meta name="8thwall:package" content="@package.package">
```

### Renderer {#renderers}

Sie können den Tag "<meta name="8thwall:renderer" ...>" verwenden, um A-Frame, three.js oder Babylon.js in Ihr Cloud-Editor-Projekt zu laden:

```
<meta name="8thwall:renderer" content="aframe:version">
<meta name="8thwall:renderer" content="threejs:version">
<meta name="8thwall:renderer" content="babylonjs:version">
```

#### aframe {#aframe}

Nur bestimmte Versionen von A-Frame werden über den Tag "<meta>" unterstützt. Das liegt daran, dass 8th Wall eine angepasste Version von A-Frame verwendet, die verschiedene Verbesserungen zur besseren Unterstützung von AR vornimmt.

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

##### Beispiel {#example}

```
<meta name="8thwall:renderer" content="aframe:1.5.0">
```

#### dreijs {#threejs}

Alle Versionen von three.js werden über das Tag "<meta>" unterstützt.

Beachten Sie, dass three.js 160+ die Verwendung von import maps anstelle eines "<meta>"-Tags erfordert. Siehe [hier](https://www.8thwall.com/8thwall/placeground-threejs/code/head.html#L8) für ein Beispiel.

##### Beispiel {#example-1}

```
<meta name="8thwall:renderer" content="threejs:159">
```

### Pakete {#packages}

Sie können das Tag "<meta name="8thwall:package" ...>" verwenden, um allgemeine Pakete in Ihr Cloud-Editor-Projekt zu laden:

| Paket                                                                                     | Inhaltlicher Wert                                                          |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [XRExtras](https://github.com/8thwall/web/tree/master/xrextras)                           | `@8thwall.xrextras`                                                        |
| [Landing Pages](https://www.8thwall.com/docs/guides/advanced-topics/landing-pages)        | @@8thwall.landing-page\`         |
| [Coaching Overlay](https://www.8thwall.com/docs/guides/advanced-topics/coaching-overlays) | @@8thwall.coaching-overlay\`     |
| [Vue](https://www.npmjs.com/package/vue)                                                  | `@vuejs.vue`                                                               |
| [HoloVideoObject](https://www.8thwall.com/8thwall/mrcs-aframe)                            | @mrcs.holovideoobject\`                       |
| [React](https://www.npmjs.com/package/react)                                              | `@react.react`                                                             |
| [React DOM](https://www.npmjs.com/package/react-dom)                                      | @@react.react-dom\`              |
| [React Router DOM](https://www.npmjs.com/package/react-router-dom)                        | @@react.react-router-dom\`       |
| [A-Frame Extras](https://www.npmjs.com/package/aframe-extras)                             | @@aframe.aframe-extras\`         |
| [A-Frame Physics System](https://www.npmjs.com/package/aframe-physics-system)             | @@aframe.aframe-physics-system\` |

#### Beispiel {#example-2}

```
<meta name="8thwall:package" content="@8thwall.xrextras">
```

Alle oben genannten "<meta>"-Tags verweisen auf offizielle CDN-URLs. Sie ziehen die neueste unterstützte Version des Pakets. Wenn Sie eine bestimmte Version verwenden möchten, verwenden Sie stattdessen ein "<script>"-Tag.

## 8. Wand CDN {#8th-wall-cdn}

8th Wall hostet eine Vielzahl von Paketen, die auf bestimmte Versionen in unserem CDN fixiert sind, um die Nutzung zu erleichtern.

#### Munition {#ammo}

- https://cdn.8thwall.com/web/aframe/ammo.wasm.js".
- https://cdn.8thwall.com/web/aframe/ammo.wasm.wasm".

#### aframe-physics-system {#aframe-physics-system}

- https://cdn.8thwall.com/web/aframe/aframe-physics-system-3.2.0.min.js".
- https://cdn.8thwall.com/web/aframe/aframe-physics-system-4.0.1.min.js".
- https://cdn.8thwall.com/web/aframe/aframe-physics-system-4.0.1-updated.min.js".
- https://cdn.8thwall.com/web/aframe/aframe-physics-system-4.2.2.min.js".

#### aframe-animation-komponente {#aframe-animation-component}

- https://cdn.8thwall.com/web/aframe/aframe-animation-component-5.1.2.min.js".

#### aframe-chromakey-material {#aframe-chromakey-material}

- https://cdn.8thwall.com/web/aframe/aframe-chromakey-material-1.1.1.min.js".

#### aframe-extras {#aframe-extras}

- https://cdn.8thwall.com/web/aframe/aframe-extras-4.2.0.min.js".
- https://cdn.8thwall.com/web/aframe/aframe-extras-6.1.0.min.js".
- https://cdn.8thwall.com/web/aframe/aframe-extras-6.1.1.min.js".
- https://cdn.8thwall.com/web/aframe/aframe-extras-7.2.0.min.js".
- https://cdn.8thwall.com/web/aframe/aframe-extras-7.2.0.min.js".

#### aframe-partikel-system-komponente {#aframe-particle-system-component}

- https://cdn.8thwall.com/web/aframe/aframe-particle-system-component-1.1.3.min.js".
- https://cdn.8thwall.com/web/aframe/aframe-particle-system-component-1.1.4.min.js".

#### aframe-spe-teilchen-komponente {#aframe-spe-particles-component}

- https://cdn.8thwall.com/web/aframe/aframe-spe-particles-component.min.js".

#### depthkit {#depthkit}

- https://cdn.8thwall.com/web/aframe/depthkit-1.0.0.min.js".

#### Holovideo-Objekt {#holovideoobject}

- https://cdn.8thwall.com/web/mrcs/holovideoobject-0.2.2.min.js".
- https://cdn.8thwall.com/web/mrcs/holovideoobject-1.2.2.min.js".
- https://cdn.8thwall.com/web/mrcs/holovideoobject-1.2.3.min.js".
- https://cdn.8thwall.com/web/mrcs/holovideoobject-1.2.5.min.js".
- https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.1.min.js".
- https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.2.min.js".
- https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.3.min.js".
- https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.4.min.js".
- https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.6.min.js".
- https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.7.min.js".
- https://cdn.8thwall.com/web/mrcs/holovideoobject-1.4.0.min.js".
- https://cdn.8thwall.com/web/mrcs/holovideoobject-1.5.0.min.js".
