---
sidebar_label: addCameraPipelineModule()
---

# XR8.addCameraPipelineModule()

`XR8.addCameraPipelineModule(module)`

## Description {#description}

Les applications de caméra 8th Wall sont construites à l'aide d'un module de pipeline de caméra. Pour une description complète des modules de canalisation de la caméra, voir [CameraPipelineModule](/api/engine/camerapipelinemodule).

Les applications installent des modules qui contrôlent ensuite le comportement de l'application au moment de l'exécution. Un objet module doit avoir une chaîne **.name** qui est unique dans l'application, et doit ensuite fournir une ou plusieurs méthodes du cycle de vie de la caméra qui seront exécutées au moment approprié dans la boucle d'exécution.

Au cours de l'exécution principale d'une application, chaque image de la caméra suit le cycle suivant :

`onBeforeRun` -> `onCameraStatusChange` (`requesting` -> `hasStream` -> `hasVideo` | `failed`) -> `onStart` -> `onAttach` -> `onProcessGpu` -> `onProcessCpu` -> `onUpdate` -> `onRender`

Les modules de caméra doivent mettre en œuvre une ou plusieurs des méthodes de cycle de vie de la caméra suivantes :

| Fonction                                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [onAppResourcesLoaded](/api/engine/camerapipelinemodule/onappresourcesloaded)           | Appelé lorsque nous avons reçu du serveur les ressources attachées à une application.                                                                                                                                                                                                                                                                                                                                     |
| [onAttach](/api/engine/camerapipelinemodule/onattach)                                   | Appelé avant la première fois qu'un module reçoit des mises à jour de trames. Il est appelé sur les modules qui ont été ajoutés avant ou après l'exécution du pipeline.                                                                                                                                                                                                                                   |
| [onBeforeRun](/api/engine/camerapipelinemodule/onbeforerun)                             | Appelé immédiatement après `XR8.run()`. Si des promesses sont renvoyées, XR attendra toutes les promesses avant de continuer.                                                                                                                                                                                                                                                                             |
| [onCameraStatusChange](/api/engine/camerapipelinemodule/oncamerastatuschange)           | Appelé lorsqu'un changement survient lors de la demande d'autorisation de la caméra.                                                                                                                                                                                                                                                                                                                                      |
| [onCanvasSizeChange](/api/engine/camerapipelinemodule/oncanvassizechange)               | Appelé lorsque le canevas change de taille.                                                                                                                                                                                                                                                                                                                                                                               |
| [onDetach](/api/engine/camerapipelinemodule/ondetach)                                   | est appelé après la dernière fois qu'un module reçoit des mises à jour de trames. Cette opération a lieu soit après l'arrêt du moteur, soit après le retrait manuel du module de la canalisation, selon ce qui se produit en premier.                                                                                                                                                                     |
| [onDeviceOrientationChange](/api/engine/camerapipelinemodule/ondeviceorientationchange) | Appelé lorsque l'appareil change d'orientation paysage/portrait.                                                                                                                                                                                                                                                                                                                                                          |
| [onException](/api/engine/camerapipelinemodule/onexception)                             | Appelé lorsqu'une erreur se produit dans le XR. Appelé avec l'objet d'erreur.                                                                                                                                                                                                                                                                                                                             |
| [onPaused](/api/engine/camerapipelinemodule/onpaused)                                   | Appelé lorsque [`XR8.pause()`](pause.md) est appelé.                                                                                                                                                                                                                                                                                                                                                                      |
| [onProcessCpu](/api/engine/camerapipelinemodule/onprocesscpu)                           | Appelé pour lire les résultats du traitement GPU et renvoyer des données utilisables.                                                                                                                                                                                                                                                                                                                                     |
| [onProcessGpu](/api/engine/camerapipelinemodule/onprocessgpu)                           | Appelé pour démarrer le traitement GPU.                                                                                                                                                                                                                                                                                                                                                                                   |
| [onRemove](/api/engine/camerapipelinemodule/onremove)                                   | est appelée lorsqu'un module est retiré du pipeline.                                                                                                                                                                                                                                                                                                                                                                      |
| [onRender](/api/engine/camerapipelinemodule/onrender)                                   | Appelé après onUpdate. C'est le moment pour le moteur de rendu d'émettre des commandes de dessin WebGL. Si une application fournit sa propre boucle d'exécution et s'appuie sur [`XR8.runPreRender()`](runprerender.md) et [`XR8.runPostRender()`](runpostrender.md), cette méthode n'est pas appelée et tous les rendus doivent être coordonnés par la boucle d'exécution externe.       |
| [onResume](/api/engine/camerapipelinemodule/onresume)                                   | Appelé lorsque [`XR8.resume()`](resume.md) est appelé.                                                                                                                                                                                                                                                                                                                                                                    |
| [onStart](/api/engine/camerapipelinemodule/onstart)                                     | Appelé au démarrage du XR. Premier callback après l'appel de `XR8.run()`.                                                                                                                                                                                                                                                                                                                                 |
| [onUpdate](/api/engine/camerapipelinemodule/onupdate)                                   | Appelé pour mettre à jour la scène avant le rendu. Les données renvoyées par les modules dans [`onProcessGpu`](/api/engine/camerapipelinemodule/onprocessgpu) et [`onProcessCpu`](/api/engine/camerapipelinemodule/onprocesscpu) seront présentes dans processGpu.modulename et processCpu.modulename où le nom est donné par module.name = "modulename". |
| [onVideoSizeChange](/api/engine/camerapipelinemodule/onvideosizechange)                 | Appelé lorsque le canevas change de taille.                                                                                                                                                                                                                                                                                                                                                                               |
| [requiredPermissions](/api/engine/camerapipelinemodule/requiredpermissions)             | Les modules peuvent indiquer les fonctionnalités du navigateur dont ils ont besoin et qui peuvent nécessiter des demandes d'autorisation. Elles peuvent être utilisées par le cadre pour demander les autorisations appropriées en cas d'absence, ou pour créer des composants qui demandent les autorisations appropriées avant d'exécuter XR.                                                           |

Note : Les modules de caméra qui implémentent [`onProcessGpu`](/api/engine/camerapipelinemodule/onprocessgpu) ou [`onProcessCpu`](/api/engine/camerapipelinemodule/onprocesscpu) peuvent fournir des données aux étapes suivantes du pipeline. Cela se fait par le nom du module.

## Paramètres {#parameters}

| Paramètres | Type    | Description                        |
| ---------- | ------- | ---------------------------------- |
| module     | `Objet` | L'objet du module. |

## Retourne {#returns}

Aucun

## Exemple 1 - Module de gestion des autorisations pour les caméras : {#example-1---a-camera-pipeline-module-for-managing-camera-permissions}

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

## Exemple 2 - une application de balayage de code QR pourrait être construite comme suit : {#example-2---a-qr-code-scanning-application-could-be-built-like-this}

```javascript
// Installer un module qui récupère le flux de la caméra sous la forme d'un UInt8Array.
XR8.addCameraPipelineModule(
  XR8.CameraPixelArray.pipelineModule({luminance: true, width: 240, height: 320}))

// Installer un module qui dessine le flux de la caméra sur le canevas.
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())

// Créer notre logique d'application personnalisée pour scanner et afficher les codes QR.
XR8.addCameraPipelineModule({
  name : 'qrscan',
  onProcessCpu : ({processGpuResult}) => {
    // CameraPixelArray.pipelineModule() a retourné ceci dans onProcessGpu.
    const { pixels, rows, cols, rowBytes } = processGpuResult.camerapixelarray
    const { wasFound, url, corners } = findQrCode(pixels, rows, cols, rowBytes)
    return { wasFound, url, corners }
  },
  onUpdate : ({processCpuResult}) => {
    // Ces données ont été renvoyées par ce module ('qrscan') dans onProcessCpu
    const {wasFound, url, corners } = processCpuResult.qrscan
    if (wasFound) {
      showUrlAndCorners(url, corners)
    }
  },
})
```
