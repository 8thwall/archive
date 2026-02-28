---
sidebar_label: demandeMicrophone()
---

# XR8.MediaRecorder.requestMicrophone()

`XR8.MediaRecorder.requestMicrophone()`

## Description {#description}

Active l'enregistrement audio (s'il n'est pas activé automatiquement), en demandant des autorisations si nécessaire.

Renvoie une promesse qui indique au client que le flux est prêt.  Si vous commencez à enregistrer
avant que le flux audio ne soit prêt, vous risquez de manquer la sortie du microphone de l'utilisateur au début de l'enregistrement
.

## Paramètres {#parameters}

Aucun

## Retourne {#returns}

Une promesse.

## Exemple {#example}

```javascript
XR8.MediaRecorder.requestMicrophone()
.then(() => {
  console.log('Microphone demandé!')
})
.catch((err) => {
  console.log('Hit an error : ', err)
})
```
