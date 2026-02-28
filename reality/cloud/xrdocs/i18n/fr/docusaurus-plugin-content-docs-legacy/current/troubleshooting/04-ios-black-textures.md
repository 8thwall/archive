---
id: ios-black-textures
---

# Textures noires sur les appareils iOS

#### Numéro {#issue}

Lors de l'utilisation d'une haute résolution et/ou d'un grand nombre de textures sur certaines versions d'iOS, Safari peut manquer de mémoire GPU. Les textures peuvent s'afficher en noir ou faire planter la page.

#### Solutions de rechange {#workarounds}

1. **Réduire la taille/résolution des textures utilisées dans votre scène** (voir
   [texture optimization](/legacy/guides/your-3d-models-on-the-web/#texture-optimization))

2. **Désactiver les bitmaps sur les appareils iOS** :

Il existe des bogues dans iOS 14 et iOS 15 liés aux bitmaps d'images qui peuvent causer des problèmes de texture.
Désactivez les bitmaps d'image pour éviter les textures noires et les plantages. Voir l'exemple ci-dessous :

#### Exemple : Désactiver les bitmaps iOS (ajouter en haut de app.js) : {#example-disable-ios-bitmaps-add-to-the-top-of-appjs}

```javascript
// Les bitmaps peuvent causer des problèmes de texture sur iOS. Cette solution de contournement permet d'éviter les textures noires et les plantages.
const IS_IOS =
  /^(iPad|iPhone|iPod)/.test(window.navigator.platform) ||
  (/^Mac/.test(window.navigator.platform) && window.navigator.maxTouchPoints > 1)
if (IS_IOS) {
  window.createImageBitmap = undefined
}
```
