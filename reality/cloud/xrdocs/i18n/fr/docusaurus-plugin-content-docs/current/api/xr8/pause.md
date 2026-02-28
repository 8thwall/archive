---
sidebar_label: pause()
---

# XR8.pause()

`XR8.pause()`

## Description {#description}

Mettre en pause la session XR en cours.  En pause, les mouvements de l'appareil ne sont pas suivis.

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
