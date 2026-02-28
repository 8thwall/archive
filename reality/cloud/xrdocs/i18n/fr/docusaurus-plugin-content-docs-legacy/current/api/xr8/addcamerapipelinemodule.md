---
sidebar_label: addCameraPipelineModule()
---

# XR8.addCameraPipelineModule()

`XR8.addCameraPipelineModule(module)`

## Description {#description}

Les applications de caméra 8th Wall sont construites à l'aide d'un module de pipeline de caméra. Pour une description complète des modules de canalisation de la caméra, voir [CameraPipelineModule](/legacy/api/camerapipelinemodule).

Les applications installent des modules qui contrôlent ensuite le comportement de l'application au moment de l'exécution. Un objet module doit avoir une chaîne **.name** qui est unique dans l'application, et doit ensuite fournir une ou plusieurs méthodes du cycle de vie de la caméra qui seront exécutées au moment approprié dans la boucle d'exécution.

Au cours de l'exécution principale d'une application, chaque image de la caméra suit le cycle suivant :

`onBeforeRun` -> `onCameraStatusChange` (`requesting` -> `hasStream` -> `hasVideo` | `failed`) -> `onStart` -> `onAttach` -> `onProcessGpu` -> `onProcessCpu` -> `onUpdate` -> `onRender`

Les modules de caméra doivent mettre en œuvre une ou plusieurs des méthodes de cycle de vie de la caméra suivantes :

| Fonction                                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [onAppResourcesLoaded](/legacy/api/camerapipelinemodule/onappresourcesloaded)           | Appelé lorsque nous avons reçu du serveur les ressources attachées à une application.                                                                                                                                                                                                                                                                                                                                     |
| [onAttach](/legacy/api/camerapipelinemodule/onattach)                                   | Appelé avant la première fois qu'un module reçoit des mises à jour de trames. Il est appelé sur les modules qui ont été ajoutés avant ou après l'exécution du pipeline.                                                                                                                                                                                                                                   |
| [onBeforeRun](/legacy/api/camerapipelinemodule/onbeforerun)                             | Appelé immédiatement après [`XR8.run()`](run.md). Si des promesses sont renvoyées, XR attendra toutes les promesses avant de continuer.                                                                                                                                                                                                                                                                   |
| [onCameraStatusChange](/legacy/api/camerapipelinemodule/oncamerastatuschange)           | Appelé lorsqu'un changement survient lors de la demande d'autorisation de la caméra.                                                                                                                                                                                                                                                                                                                                      |
| [onCanvasSizeChange](/legacy/api/camerapipelinemodule/oncanvassizechange)               | Appelé lorsque le canevas change de taille.                                                                                                                                                                                                                                                                                                                                                                               |
| [onDetach](/legacy/api/camerapipelinemodule/ondetach)                                   | est appelé après la dernière fois qu'un module reçoit des mises à jour de trames. Cette opération a lieu soit après l'arrêt du moteur, soit après le retrait manuel du module de la canalisation, selon ce qui se produit en premier.                                                                                                                                                                     |
| [onDeviceOrientationChange](/legacy/api/camerapipelinemodule/ondeviceorientationchange) | Appelé lorsque l'appareil change d'orientation paysage/portrait.                                                                                                                                                                                                                                                                                                                                                          |
| [onException](/legacy/api/camerapipelinemodule/onexception)                             | Appelé lorsqu'une erreur se produit dans le XR. Appelé avec l'objet d'erreur.                                                                                                                                                                                                                                                                                                                             |
| [onPaused](/legacy/api/camerapipelinemodule/onpaused)                                   | Appelé lorsque [`XR8.pause()`](pause.md) est appelé.                                                                                                                                                                                                                                                                                                                                                                      |
| [onProcessCpu](/legacy/api/camerapipelinemodule/onprocesscpu)                           | Appelé pour lire les résultats du traitement GPU et renvoyer des données utilisables.                                                                                                                                                                                                                                                                                                                                     |
| [onProcessGpu](/legacy/api/camerapipelinemodule/onprocessgpu)                           | Appelé pour démarrer le traitement GPU.                                                                                                                                                                                                                                                                                                                                                                                   |
| [onRemove](/legacy/api/camerapipelinemodule/onremove)                                   | est appelée lorsqu'un module est retiré du pipeline.                                                                                                                                                                                                                                                                                                                                                                      |
| [onRender](/legacy/api/camerapipelinemodule/onrender)                                   | Appelé après onUpdate. C'est le moment pour le moteur de rendu d'émettre des commandes de dessin WebGL. Si une application fournit sa propre boucle d'exécution et s'appuie sur [`XR8.runPreRender()`](runprerender.md) et [`XR8.runPostRender()`](runpostrender.md), cette méthode n'est pas appelée et tous les rendus doivent être coordonnés par la boucle d'exécution externe.       |
| [onResume](/legacy/api/camerapipelinemodule/onresume)                                   | Appelé lorsque [`XR8.resume()`](resume.md) est appelé.                                                                                                                                                                                                                                                                                                                                                                    |
| [onStart](/legacy/api/camerapipelinemodule/onstart)                                     | Appelé au démarrage du XR. Premier rappel après l'appel de [`XR8.run()`](run.md).                                                                                                                                                                                                                                                                                                                         |
| [onUpdate](/legacy/api/camerapipelinemodule/onupdate)                                   | Appelé pour mettre à jour la scène avant le rendu. Les données renvoyées par les modules dans [`onProcessGpu`](/legacy/api/camerapipelinemodule/onprocessgpu) et [`onProcessCpu`](/legacy/api/camerapipelinemodule/onprocesscpu) seront présentes dans processGpu.modulename et processCpu.modulename où le nom est donné par module.name = "modulename". |
| [onVideoSizeChange](/legacy/api/camerapipelinemodule/onvideosizechange)                 | Appelé lorsque le canevas change de taille.                                                                                                                                                                                                                                                                                                                                                                               |
| [requiredPermissions](/legacy/api/camerapipelinemodule/requiredpermissions)             | Les modules peuvent indiquer les fonctionnalités du navigateur dont ils ont besoin et qui peuvent nécessiter des demandes d'autorisation. Elles peuvent être utilisées par le cadre pour demander les autorisations appropriées en cas d'absence, ou pour créer des composants qui demandent les autorisations appropriées avant d'exécuter XR.                                                           |

Note : Les modules de caméra qui implémentent [`onProcessGpu`](/legacy/api/camerapipelinemodule/onprocessgpu) ou [`onProcessCpu`](/legacy/api/camerapipelinemodule/onprocesscpu) peuvent fournir des données aux étapes suivantes du pipeline. Cela se fait par le nom du module.

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
