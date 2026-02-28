---
sidebar_label: isPaused()
---

# XR8.isPaused()

`XR8.isPaused()`

## Description {#description}

Indique si la session XR est en pause ou non.

## Paramètres {#parameters}

Aucun

## Retourne {#returns}

Vrai si la session XR est en pause, faux sinon.

## Exemple {#example}

```javascript
// Appeler XR8.pause() / XR8.resume() lorsque le bouton est pressé.
document.getElementById('pause').addEventListener(
  'click',
  () => {
    if (!XR8.isPaused()) {
      XR8.pause()
    } else {
      XR8.resume()
    }
  },
  true)
```
