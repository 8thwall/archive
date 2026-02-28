---
sidebar_label: runFaceEffects() (obsolète)
---

# XR8.PlayCanvas.runFaceEffects() (obsolète)

`XR8.PlayCanvas.runFaceEffects( {pcCamera, pcApp}, [extraModules], config )`

## Description {#description}

Ouvre la caméra et lance l'exécution du suivi du monde XR et/ou des cibles d'image dans une scène PlayCanvas.

## Paramètres {#parameters}

| Paramètres                                                                    | Description                                                                               |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| pcCamera                                                                      | La caméra de scène PlayCanvas pour conduire avec la RA.                   |
| pcApp                                                                         | L'application PlayCanvas, typiquement `this.app`.                         |
| extraModules [Facultatif] | Un ensemble optionnel de modules de pipeline supplémentaires à installer. |
| config                                                                        | Paramètres de configuration à transmettre à [`XR8.run()`](/legacy/api/xr8/run)            |

`config` est un objet avec les propriétés suivantes :

| Propriété                                                                                                   | Type                                                                                             | Défaut                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| toile                                                                                                       | [`HTMLCanvasElement`](https://developer.mozilla.org/en-US/docs/Web/legacy/api/HTMLCanvasElement) |                                            | Le canevas HTML sur lequel le flux de la caméra sera dessiné. Il s'agit généralement de "application-canvas".                                                                                                                                                                                                                                                                                           |
| webgl2 [Facultatif]                                     | `Booléen`                                                                                        | `false`                                    | Si vrai, utiliser WebGL2 si disponible, sinon utiliser WebGL1.  Si faux, toujours utiliser WebGL1.                                                                                                                                                                                                                                                                                                      |
| ownRunLoop [Facultatif]                                 | `Booléen`                                                                                        | `false`                                    | Si c'est le cas, XR doit utiliser sa propre boucle d'exécution.  Si false, vous fournirez votre propre boucle d'exécution et serez responsable de l'appel à [`XR8.runPreRender()`](/legacy/api/xr8/runprerender) et [`XR8.runPostRender()`](/legacy/api/xr8/runpostrender) vous-même [Utilisateurs avancés uniquement].                             |
| cameraConfig : {direction} [Facultatif] | `Objet`                                                                                          | `{direction : XR8.XrConfig.camera().BACK}` | Appareil photo souhaité. Les valeurs prises en charge pour `direction` sont `XR8.XrConfig.camera().BACK` ou `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                                                                               |
| glContextConfig [Facultatif]                            | `WebGLContextAttributes` (en anglais)                                         | `null`                                     | Les attributs permettant de configurer le contexte de la toile WebGL.                                                                                                                                                                                                                                                                                                                                                   |
| allowedDevices [Facultatif]                             | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device)                                           | `XR8.XrConfig.device().MOBILE`             | Spécifier la classe des appareils sur lesquels le pipeline doit fonctionner.  Si l'appareil actuel ne fait pas partie de cette classe, l'exécution échouera avant l'ouverture de la caméra. Si allowedDevices est `XR8.XrConfig.device().ANY`, la caméra est toujours ouverte. Notez que le suivi du monde ne peut être utilisé qu'avec `XR8.XrConfig.device().MOBILE`. |

## Retourne {#returns}

Aucun
