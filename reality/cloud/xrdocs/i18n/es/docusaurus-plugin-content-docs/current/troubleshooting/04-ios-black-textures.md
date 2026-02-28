---
id: ios-black-textures
---

# Texturas negras en dispositivos iOS

#### Problema {#issue}

Cuando se utiliza alta resolución y/o un gran número de texturas en ciertas versiones de iOS, Safari puede quedarse sin memoria en la GPU. Las texturas pueden aparecer en negro o hacer que la página se bloquee.

#### Soluciones {#workarounds}

1. **Reduzca el tamaño/la resolución de las texturas utilizadas en su escena** (consulte [optimización de texturas](/guides/your-3d-models-on-the-web/#texture-optimization))

2. **Desactive mapas de bits de imágenes en dispositivos iOS**:

Existen errores en iOS 14 y iOS 15 relacionados con mapas de bits de imágenes que pueden causar problemas de textura. Desactive los mapas de bits de las imágenes para evitar las texturas negras y los fallos. Véase el ejemplo siguiente:

#### Ejemplo: desactive los mapas de bits de iOS (añádalo al principio de app.js): {#example-disable-ios-bitmaps-add-to-the-top-of-appjs}

```javascript
// Los mapas de bits pueden causar problemas de textura en iOS. Esta solución puede ayudar a evitar las texturas negras y los fallos.
const IS_IOS =
  /^(iPad|iPhone|iPod)/.test(window.navigator.platform) ||
  (/^Mac/.test(window.navigator.platform) && window.navigator.maxTouchPoints > 1)
if (IS_IOS) {
  window.createImageBitmap = undefined
}}
```
