---
sidebar_label: recordVideo()
---

# XR8.MediaRecorder.recordVideo()

`XR8.MediaRecorder.recordVideo({ onError, onProcessFrame, onStart, onStop, onVideoReady })`

## Description {#description}

Démarrer l'enregistrement.

Cette fonction prend un objet qui implémente une ou plusieurs des méthodes de rappel du cycle de licence de l'enregistreur de médias suivantes :

## Paramètres {#parameters}

| Paramètres         | Description                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| onError            | Rappel en cas d'erreur.                                                                                        |
| onProcessFrame     | Renvoi pour l'ajout d'une incrustation à la vidéo.                                                             |
| onStart            | Rappel lorsque l'enregistrement a commencé.                                                                    |
| onStop             | Rappel lorsque l'enregistrement s'est arrêté.                                                                  |
| onPreviewReady     | Rappel lorsqu'une vidéo prévisible, mais non optimisée pour le partage, est prête (Android/Bureau uniquement). |
| onFinalizeProgress | Rappel lorsque l'enregistreur de médias progresse dans l'exportation finale (Android/Desktop uniquement).      |
| onVideoReady       | Rappel lorsque l'enregistrement est terminé et que la vidéo est prête.                                         |

**Note :** Lorsque le navigateur prend en charge le webm et non le mp4 (actuellement Android/Desktop), le webm est utilisable comme vidéo de prévisualisation, mais il est converti en mp4 pour générer la vidéo finale. `onPreviewReady` est appelé lorsque la conversion commence, pour permettre à l'utilisateur de voir la vidéo immédiatement, et lorsque le fichier mp4 est prêt, `onVideoReady` sera appelé. Pendant la conversion, `onFinalizeProgress` est appelé périodiquement pour permettre l'affichage d'une barre de progression.

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
XR8.MediaRecorder.recordVideo({
  onVideoReady : (result) => window.dispatchEvent(new CustomEvent('recordercomplete', {detail: result})),
  onStop : () => showLoading(),
  onError : () => clearState(),
  onProcessFrame : ({elapsedTimeMs, maxRecordingMs, ctx}) => {
    // superposer du texte rouge sur la vidéo
    ctx.fillStyle = 'red'
    ctx.font = '50px "Nunito"'
    ctx.fillText(`${elapsedTimeMs}/${maxRecordingMs}`, 50, 50)
    const timeLeft = ( 1 - elapsedTimeMs / maxRecordingMs)
    // mettre à jour la barre de progression pour indiquer le temps restant
    progressBar.style.strokeDashoffset = `${100 * timeLeft }`
  },
  onFinalizeProgress : ({progress, total}) => {
    console.log('Export is ' + Math.round(progress / total) + '% complete')
  },
})
```
