---
id: ios-black-textures
---

# Texturas negras en dispositivos iOS

#### Edición {#issue}

Cuando se utiliza alta resolución y/o un gran número de texturas en ciertas versiones de iOS, Safari puede quedarse sin memoria en la GPU. Las texturas pueden aparecer en negro o hacer que la página se bloquee.

#### Soluciones {#workarounds}

1. **Reducir el tamaño/resolución de las texturas utilizadas en tu escena** (ver
   [optimización de texturas](/legacy/guides/your-3d-models-on-the-web/#texture-optimization))

2. **Desactivar mapas de bits de imágenes en dispositivos iOS**:

Existen errores en iOS 14 y iOS 15 relacionados con los mapas de bits de las imágenes que pueden causar problemas con las texturas.
Desactiva los mapas de bits de las imágenes para evitar texturas negras y fallos. Véase el ejemplo siguiente:

#### Ejemplo: Desactivar mapas de bits de iOS (añadir al principio de app.js): {#example-disable-ios-bitmaps-add-to-the-top-of-appjs}

```javascript
// Los mapas de bits pueden causar problemas de textura en iOS. Esta solución puede ayudar a evitar texturas negras y fallos.
const IS_IOS =
  /^(iPad|iPhone|iPod)/.test(window.navigator.platform) ||
  (/^Mac/.test(window.navigator.platform) && window.navigator.maxTouchPoints > 1)
if (IS_IOS) {
  window.createImageBitmap = undefined
}
```
