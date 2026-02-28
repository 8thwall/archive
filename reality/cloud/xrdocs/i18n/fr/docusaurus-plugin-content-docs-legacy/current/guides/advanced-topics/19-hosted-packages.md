---
id: hosted-packages
---

# Paquets hébergés

## Balises méta {#meta-tags}

Utilisez les balises 8th Wall `<meta>` pour charger rapidement les moteurs de rendu et les paquets courants dans votre projet d'éditeur de nuages.

Utilisez l'attribut `name` pour spécifier si vous chargez un `renderer` ou un `package`, et l'attribut `content` pour spécifier quel rendererer/package :

```
<meta name="8thwall:renderer" content="renderer:version">
<meta name="8thwall:package" content="@package.package">
```

### Renderers {#renderers}

Vous pouvez utiliser la balise `<meta name="8thwall:renderer" ...>` pour charger A-Frame, three.js ou Babylon.js dans votre projet d'éditeur de nuages :

```
<meta name="8thwall:renderer" content="aframe:version">
<meta name="8thwall:renderer" content="threejs:version">
<meta name="8thwall:renderer" content="babylonjs:version">
```

#### aframe {#aframe}

Seules certaines versions de A-Frame sont prises en charge par la balise `<meta>`. En effet, 8th Wall utilise une version personnalisée d'A-Frame qui apporte diverses améliorations pour mieux prendre en charge la réalité augmentée.

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

##### Exemple {#example}

```
<meta name="8thwall:renderer" content="aframe:1.5.0">
```

#### threejs {#threejs}

Toutes les versions de three.js sont supportées par la balise `<meta>`.

Notez que three.js 160+ requiert l'utilisation de cartes d'importation au lieu d'une balise `<meta>`. Voir [ici](https://www.8thwall.com/8thwall/placeground-threejs/code/head.html#L8) pour un exemple.

##### Exemple {#example-1}

```
<meta name="8thwall:renderer" content="threejs:159">
```

### Paquets {#packages}

Vous pouvez utiliser la balise `<meta name="8thwall:package" ...>` pour charger des paquets communs dans votre projet d'éditeur de nuages :

| Paquet                                                                                                      | Valeur du contenu                                           |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [XRExtras](https://github.com/8thwall/web/tree/master/xrextras)                                             | `@8thwall.xrextras`                                         |
| [Pages d'atterrissage](https://www.8thwall.com/docs/legacy/guides/advanced-topics/landing-pages)            | `@8thwall.landing-page`                                     |
| [Superposition d'entraîneurs](https://www.8thwall.com/docs/legacy/guides/advanced-topics/coaching-overlays) | `@8thwall.coaching-overlay` (en anglais) |
| [Vue](https://www.npmjs.com/package/vue)                                                                    | `@vuejs.vue`                                                |
| [HoloVideoObject](https://www.8thwall.com/8thwall/mrcs-aframe)                                              | `@mrcs.holovideoobject`                                     |
| [React](https://www.npmjs.com/package/react)                                                                | `@react.react`                                              |
| [React DOM](https://www.npmjs.com/package/react-dom)                                                        | `@react.react-dom`                                          |
| [React Router DOM](https://www.npmjs.com/package/react-router-dom)                                          | `@react.react-router-dom`                                   |
| [Extras A-Frame](https://www.npmjs.com/package/aframe-extras)                                               | `@aframe.aframe-extras`                                     |
| [Système physique A-Frame](https://www.npmjs.com/package/aframe-physics-system)                             | `@aframe.aframe-physics-system`                             |

#### Exemple {#example-2}

```
<meta name="8thwall:package" content="@8thwall.xrextras">
```

Tous les tags `<meta>` ci-dessus évaluent les URLs CDN officielles. Ils utiliseront la dernière version supportée du paquet. Si vous souhaitez utiliser une version spécifique, utilisez plutôt la balise `<script>`.

## 8th Wall CDN {#8th-wall-cdn}

8th Wall héberge une variété de paquets fixés à des versions spécifiques sur notre CDN pour plus de commodité.

#### munitions {#ammo}

- `https://cdn.8thwall.com/web/aframe/ammo.wasm.js`
- `https://cdn.8thwall.com/web/aframe/ammo.wasm.wasm`

#### aframe-physics-system {#aframe-physics-system}

- `https://cdn.8thwall.com/web/aframe/aframe-physics-system-3.2.0.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-physics-system-4.0.1.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-physics-system-4.0.1-updated.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-physics-system-4.2.2.min.js`

#### aframe-animation-component {#aframe-animation-component}

- `https://cdn.8thwall.com/web/aframe/aframe-animation-component-5.1.2.min.js`

#### aframe-chromakey-material {#aframe-chromakey-material}

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

#### kit de profondeur {#depthkit}

- `https://cdn.8thwall.com/web/aframe/depthkit-1.0.0.min.js`

#### Objet holovidéo {#holovideoobject}

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

## Chargement de morceaux de moteur spécifiques

Pour minimiser la taille du téléchargement de l'utilisateur final, vous pouvez charger de manière sélective uniquement les fonctionnalités nécessaires du moteur en utilisant les méthodes ci-dessous.

### Editeur de nuages

Vous pouvez spécifier les morceaux à précharger en ajoutant la balise méta suivante à `head.html`.

- Morceaux acceptés : "slam", "hand", "face".

```html
<meta name="8thwall:preloadChunks" content="slam,hand,face" />
```

### Auto-hébergé

Vous pouvez également définir les morceaux requis en ajoutant la balise de script suivante :

- Les morceaux acceptés sont "slam", "hand", "face".

```html
<script> window._XR8Chunks = ['slam'] </script>
```
