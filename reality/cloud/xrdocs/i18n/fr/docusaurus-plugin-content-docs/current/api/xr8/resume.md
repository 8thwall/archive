---
sidebar_label: resume()
---

# XR8.resume()

`XR8.resume()`

## Description {#description}

Reprendre la session XR en cours après l'avoir interrompue.

## Paramètres {#parameters}

Aucun

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
// Appelez XR8.pause() / XR8.resume() lorsque vous appuyez sur le bouton.
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
