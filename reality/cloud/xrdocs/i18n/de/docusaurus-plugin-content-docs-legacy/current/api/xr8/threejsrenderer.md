---
sidebar_label: ThreejsRenderer() (veraltet)
---

# XR8.ThreejsRenderer() (veraltet)

`XR8.ThreejsRenderer()`

## Beschreibung {#description}

Gibt einen auf three.js basierenden Renderer zurück.  Sie ist verantwortlich für die Steuerung der Szenenkamera, die Anpassung des Kamerablickfelds an das AR-Blickfeld und den Aufruf von 'render' innerhalb der Kameraausführungsschleife.

Wenn Sie three.js verwenden, fügen Sie dies als Kamera-Pipeline-Modul hinzu, um die three.js-Szene, die Kamera und den Renderer zu erstellen und die Szenenkamera basierend auf der 6DoF-Kamerabewegung zu steuern.

## Parameter {#parameters}

Keine

## Beispiel {#example}

```javascript
window.onload = () => {
  // xr3js besitzt die three.js Szene, Kamera und Renderer. Es ist verantwortlich für die Steuerung der Szenenkamera,
  // den Abgleich des Kamera-Sichtfeldes mit dem AR-Sichtfeld und für den Aufruf von 'render' innerhalb der
  // Kamera-Laufschleife.
  const xr3js = XR8.ThreejsRenderer()

  // XR-Controller bietet 6DoF-Kamera-Tracking und Schnittstellen zur Konfiguration des Trackings.
  const xrController = XR8.xrController()

  // ...

  // Fügen Sie das xrController-Modul hinzu, das die 6DoF-Kamerabewegungsschätzung ermöglicht.
  XR8.addCameraPipelineModule(xrController.cameraPipelineModule())

  // Fügen Sie einen GLRenderer hinzu, der den Kamerafeed auf die Leinwand zeichnet.
  XR8.addCameraPipelineModule(XR8.GLRenderer())

  // Fügen Sie xr3js hinzu, das eine threejs-Szene, eine Kamera und einen Renderer erstellt und die Szenenkamera
  // basierend auf der 6DoF-Kamerabewegung steuert.
  XR8.addCameraPipelineModule(xr3js)

  // ...
}
```
