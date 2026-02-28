---
id: hosted-packages
---
# Hosted packages

## Meta tags {#meta-tags}

Use 8th Wall `<meta>` tags to quickly load common renderers and packages to your cloud editor project.

Use the `name` attribute to specify whether you are loading a `renderer` or a `package`, and the `content` attribute to specify which renderer/package:

```
<meta name="8thwall:renderer" content="renderer:version">
<meta name="8thwall:package" content="@package.package">
```

### Renderers {#renderers}

You can use the `<meta name="8thwall:renderer" ...>` tag to load A-Frame, three.js or Babylon.js to your cloud editor project:

```
<meta name="8thwall:renderer" content="aframe:version">
<meta name="8thwall:renderer" content="threejs:version">
<meta name="8thwall:renderer" content="babylonjs:version">
```

#### aframe {#aframe}

Only certain versions of A-Frame are supported via the `<meta>` tag. This is because 8th Wall uses a custom version of A-Frame that makes various improvements to better support AR.

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

##### Example {#example}

```
<meta name="8thwall:renderer" content="aframe:1.5.0">
```

#### threejs {#threejs}

All versions of three.js are supported via the `<meta>` tag.

Note that three.js 160+ requires the use of import maps instead of a `<meta>` tag. See [here](https://www.8thwall.com/8thwall/placeground-threejs/code/head.html#L8) for an example.

##### Example {#example-1}

```
<meta name="8thwall:renderer" content="threejs:159">
```

### Packages {#packages}

You can use the `<meta name="8thwall:package" ...>` tag to load common packages to your cloud editor project:

| Package                                                                                   | Content Value                   |
|-------------------------------------------------------------------------------------------|---------------------------------|
| [XRExtras](https://github.com/8thwall/web/tree/master/xrextras)                           | `@8thwall.xrextras`             |
| [Landing Pages](https://www.8thwall.com/docs/legacy/guides/advanced-topics/landing-pages)        | `@8thwall.landing-page`         |
| [Coaching Overlay](https://www.8thwall.com/docs/legacy/guides/advanced-topics/coaching-overlays) | `@8thwall.coaching-overlay`     |
| [Vue](https://www.npmjs.com/package/vue)                                                  | `@vuejs.vue`                    |
| [HoloVideoObject](https://www.8thwall.com/8thwall/mrcs-aframe)                            | `@mrcs.holovideoobject`         |
| [React](https://www.npmjs.com/package/react)                                              | `@react.react`                  |
| [React DOM](https://www.npmjs.com/package/react-dom)                                      | `@react.react-dom`              |
| [React Router DOM](https://www.npmjs.com/package/react-router-dom)                        | `@react.react-router-dom`       |
| [A-Frame Extras](https://www.npmjs.com/package/aframe-extras)                             | `@aframe.aframe-extras`         |
| [A-Frame Physics System](https://www.npmjs.com/package/aframe-physics-system)             | `@aframe.aframe-physics-system` |


#### Example {#example-2}

```
<meta name="8thwall:package" content="@8thwall.xrextras">
```

All of the `<meta>` tags above evaluate to official CDN URLs. They will pull the latest supported version of the package. If you want to use a specific version, use a `<script>` tag instead.

## 8th Wall CDN {#8th-wall-cdn}

8th Wall hosts a variety of packages fixed to specific versions on our CDN for convenience.

#### ammo {#ammo}
* `https://cdn.8thwall.com/web/aframe/ammo.wasm.js`
* `https://cdn.8thwall.com/web/aframe/ammo.wasm.wasm`

#### aframe-physics-system {#aframe-physics-system}
* `https://cdn.8thwall.com/web/aframe/aframe-physics-system-3.2.0.min.js`
* `https://cdn.8thwall.com/web/aframe/aframe-physics-system-4.0.1.min.js`
* `https://cdn.8thwall.com/web/aframe/aframe-physics-system-4.0.1-updated.min.js`
* `https://cdn.8thwall.com/web/aframe/aframe-physics-system-4.2.2.min.js`

#### aframe-animation-component {#aframe-animation-component}
* `https://cdn.8thwall.com/web/aframe/aframe-animation-component-5.1.2.min.js`

#### aframe-chromakey-material {#aframe-chromakey-material}
* `https://cdn.8thwall.com/web/aframe/aframe-chromakey-material-1.1.1.min.js`

#### aframe-extras {#aframe-extras}
* `https://cdn.8thwall.com/web/aframe/aframe-extras-4.2.0.min.js`
* `https://cdn.8thwall.com/web/aframe/aframe-extras-6.1.0.min.js`
* `https://cdn.8thwall.com/web/aframe/aframe-extras-6.1.1.min.js`
* `https://cdn.8thwall.com/web/aframe/aframe-extras-7.2.0.min.js`
* `https://cdn.8thwall.com/web/aframe/aframe-extras-7.2.0.min.js`

#### aframe-particle-system-component {#aframe-particle-system-component}
* `https://cdn.8thwall.com/web/aframe/aframe-particle-system-component-1.1.3.min.js`
* `https://cdn.8thwall.com/web/aframe/aframe-particle-system-component-1.1.4.min.js`

#### aframe-spe-particles-component {#aframe-spe-particles-component}
* `https://cdn.8thwall.com/web/aframe/aframe-spe-particles-component.min.js`

#### depthkit {#depthkit}
* `https://cdn.8thwall.com/web/aframe/depthkit-1.0.0.min.js`

#### holovideoobject {#holovideoobject}
* `https://cdn.8thwall.com/web/mrcs/holovideoobject-0.2.2.min.js`
* `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.2.2.min.js`
* `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.2.3.min.js`
* `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.2.5.min.js`
* `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.1.min.js`
* `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.2.min.js`
* `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.3.min.js`
* `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.4.min.js`
* `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.6.min.js`
* `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.7.min.js`
* `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.4.0.min.js`
* `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.5.0.min.js`

## Loading Specific Engine Chunks
To minimize the end-user’s download size, you can selectively load only the necessary engine features using the methods below.

### Cloud Editor
You can specify which chunks to preload by adding the following meta tag to `head.html`.
* Accepted chunks: 'slam', 'hand', 'face'.

```html
<meta name="8thwall:preloadChunks" content="slam,hand,face" />
```

### Self Hosted
Alternatively, you can define the required chunks by adding the following script tag:
* Accepted chunks are 'slam', 'hand', 'face'.

```html 
<script> window._XR8Chunks = ['slam'] </script>
```
