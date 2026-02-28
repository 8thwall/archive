---
sidebar_label: ThreejsRenderer() (veraltet)
---

# XR8.ThreejsRenderer() (veraltet)

`XR8.ThreejsRenderer()`

## Beschreibung {#description}

Liefert einen auf three.js basierenden Renderer.  Sie ist für die Steuerung der Szenenkamera, die Anpassung des Kamerablickfelds an das AR-Blickfeld und den Aufruf von 'rendern' innerhalb der Kameralaufschleife verantwortlich.

Wenn Sie three.js verwenden, fügen Sie dies als Kamera-Pipeline-Modul hinzu, um die Szene, die Kamera und den Renderer in three.js zu erstellen und die Kamera der Szene basierend auf der 6DoF-Kamerabewegung zu steuern.

## Parameter {#parameters}

Keine

## Beispiel {#example}

```javascript
window.onload = () => {
  // xr3js besitzt die three.js Szene, die Kamera und den Renderer. Sie ist verantwortlich für die Steuerung der Szenenkamera,
  // die Anpassung des Kamerablickfelds an das AR-Blickfeld und für den Aufruf von 'rendern' innerhalb der
  // Kameralaufschleife.
  const xr3js = XR8.ThreejsRenderer()

  // Der XR-Controller bietet 6DoF-Kamera-Tracking und Schnittstellen zur Konfiguration des Trackings.
  const xrController = XR8.xrController()

  // ...

  // Fügen Sie das Modul xrController hinzu, das eine 6DoF-Kamerabewegungsschätzung ermöglicht.
  XR8.addCameraPipelineModule(xrController.cameraPipelineModule())

  // Fügen Sie einen GLRenderer hinzu, der den Kamerafeed auf die Leinwand zeichnet.
  XR8.addCameraPipelineModule(XR8.GLRenderer())

  // Fügen Sie xr3js hinzu, das eine threejs-Szene, eine Kamera und einen Renderer erstellt und die Szenenkamera
  // basierend auf der 6DoF-Kamerabewegung ansteuert.
  XR8.addCameraPipelineModule(xr3js)

  // ...
}
```
