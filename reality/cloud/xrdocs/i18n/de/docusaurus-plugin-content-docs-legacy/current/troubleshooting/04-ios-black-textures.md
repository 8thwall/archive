---
id: ios-black-textures
---

# Schwarze Texturen auf iOS-Geräten

#### Ausgabe {#issue}

Bei der Verwendung einer hohen Auflösung und/oder einer großen Anzahl von Texturen auf bestimmten Versionen von iOS kann Safari der GPU-Speicher ausgehen. Die Texturen werden möglicherweise schwarz dargestellt oder führen zum Absturz der Seite.

#### Umgehungen {#workarounds}

1. **Reduzieren Sie die Größe/Auflösung der in Ihrer Szene verwendeten Texturen** (siehe
   [Texturoptimierung](/legacy/guides/your-3d-models-on-the-web/#texture-optimization))

2. **Bild-Bitmaps auf iOS-Geräten deaktivieren**:

In iOS 14 und iOS 15 gibt es Bugs im Zusammenhang mit Bild-Bitmaps, die Texturprobleme verursachen können.
Deaktivieren Sie Bild-Bitmaps, um schwarze Texturen und Abstürze zu vermeiden. Siehe Beispiel unten:

#### Beispiel: iOS Bitmaps deaktivieren (oben in app.js hinzufügen): {#example-disable-ios-bitmaps-add-to-the-top-of-appjs}

```javascript
// Bitmaps können Texturprobleme unter iOS verursachen. Dieser Workaround kann helfen, schwarze Texturen und Abstürze zu vermeiden.
const IS_IOS =
  /^(iPad|iPhone|iPod)/.test(window.navigator.platform) ||
  (/^Mac/.test(window.navigator.platform) && window.navigator.maxTouchPoints > 1)
if (IS_IOS) {
  window.createImageBitmap = undefined
}
```
