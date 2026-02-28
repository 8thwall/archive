---
sidebar_label: reprendre()
---

# XR8.resume()

`XR8.resume()`

## Description {#description}

Reprendre la session XR en cours après l'avoir interrompue.

## Paramètres {#parameters}

Aucun

## Retourne {#returns}

Aucun

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
