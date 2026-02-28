---
sidebar_label: pause()
---

# XR8.pause()

`XR8.pause()`

## Description {#description}

Mettre en pause la session XR en cours.  En pause, les mouvements de l'appareil ne sont pas suivis.

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
