---
sidebar_label: isPaused()
---

# XR8.isPaused()

`XR8.isPaused()`

## Description {#description}

Indique si la session XR est en pause ou non.

## Paramètres {#parameters}

Aucun

## Retours {#returns}

Vrai si la session XR est en pause, faux sinon.

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
