---
id: ios-black-textures
---

# Schwarze Texturen auf iOS-Geräten

#### Ausgabe {#issue}

Wenn Sie auf bestimmten iOS-Versionen eine hohe Auflösung und/oder eine große Anzahl von Texturen verwenden, kann Safari der GPU-Speicher ausgehen. Die Texturen werden möglicherweise schwarz dargestellt oder führen zu einem Absturz der Seite.

#### Umgehungen {#workarounds}

1. **Reduzieren Sie die Größe/Auflösung der in Ihrer Szene verwendeten Texturen** (siehe [texture optimization](/guides/your-3d-models-on-the-web/#texture-optimization))

2. **Deaktivieren Sie Bild-Bitmaps auf iOS-Geräten**:

In iOS 14 und iOS 15 gibt es Bugs im Zusammenhang mit Bild-Bitmaps, die Texturprobleme verursachen können. Deaktivieren Sie Bild-Bitmaps, um schwarze Texturen und Abstürze zu vermeiden. Siehe Beispiel unten:

#### Beispiel: Deaktivieren Sie iOS Bitmaps (oben in der app.js hinzufügen): {#example-disable-ios-bitmaps-add-to-the-top-of-appjs}

```javascript
// Bitmaps können unter iOS Texturprobleme verursachen. Diese Abhilfe kann helfen, schwarze Texturen und Abstürze zu vermeiden.
const IS_IOS =
  /^(iPad|iPhone|iPod)/.test(window.navigator.platform) ||
  (/^Mac/.test(window.navigator.platform) && window.navigator.maxTouchPoints > 1)
if (IS_IOS) {
  window.createImageBitmap = undefined
}
```
