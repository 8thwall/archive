# onCameraStatusChange()

`onCameraStatusChange : ({ status, stream, video, config })`

## Description {#description}

`onCameraStatusChange()` est appelé lorsqu'un changement survient lors de la demande d'autorisation de la caméra.

Appelé avec le statut et, le cas échéant, une référence aux nouvelles données disponibles. Le flux d'état typique sera le suivant :

`demandant` -> `hasStream` -> `hasVideo`.

## Paramètres {#parameters}

| Paramètres            | Description                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| statut                | Un des éléments suivants : [ `'requesting'`, `'hasStream'`, `'hasVideo'`, `'failed'` ]                                                         |
| stream : [Facultatif] | Le [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) associé au flux de la caméra, si le statut est `'hasStream'`. |
| vidéo : [Optionnel]   | L'élément DOM vidéo affichant le flux, si le statut est hasVideo.                                                                              |
| config                | Les paramètres de configuration qui ont été transmis à [`XR8.run()`](/api/xr8/run), si le statut est `'requesting'`.                           |

Le paramètre `status` a les états suivants :

| État      | Description                                                                                                                                                                                                      |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| demandant | Dans `'requesting'`, le navigateur ouvre la caméra et, le cas échéant, vérifie les permissions de l'utilisateur. Dans ce cas, il convient d'inviter l'utilisateur à accepter les autorisations de la caméra.     |
| hasStream | Une fois les autorisations accordées à l'utilisateur et la caméra ouverte avec succès, l'état passe à `"hasStream"` et toutes les invites de l'utilisateur concernant les autorisations peuvent être supprimées. |
| aVidéo    | Une fois que les données de la caméra commencent à être disponibles pour le traitement, l'état passe à `"hasVideo"`, et le flux de la caméra peut commencer à s'afficher.                                        |
| échoué    | Si le flux de la caméra ne s'ouvre pas, l'état est le suivant : `'failed'`. Dans ce cas, il est possible que l'utilisateur ait refusé des autorisations et il est donc conseillé de l'aider à les réactiver.     |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'camerastartupmodule',
  onCameraStatusChange : ({status}) {
    if (status == 'requesting') {
      myApplication.showCameraPermissionsPrompt()
    } else if (status == 'hasStream') {
      myApplication.dismissCameraPermissionsPrompt()
    } else if (status == 'hasVideo') {
      myApplication.startMainApplictation()
    } else if (status == 'failed') {
      myApplication.promptUserToChangeBrowserSettings()
    }
  },
})
```
