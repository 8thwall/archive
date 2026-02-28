---
sidebar_label: xrwebComponent()
---

# XR8.AFrame.xrwebComponent()

`XR8.AFrame.xrwebComponent()`

## Beschreibung {#description}

Erzeugt eine A-Frame-Komponente, die mit `AFRAME.registerComponent()` registriert werden kann. Dies muss jedoch im Allgemeinen nicht direkt aufgerufen werden. Beim Laden des 8. Wall-Web-Skripts wird diese Komponente automatisch registriert, wenn erkannt wird, dass A-Frame geladen wurde (d.h. wenn `window.AFRAME` existiert).

## Parameter {#parameters}

Keine

## Beispiel {#example}

```javascript
window.AFRAME.registerComponent('xrweb', XR8.AFrame.xrwebComponent())
```
