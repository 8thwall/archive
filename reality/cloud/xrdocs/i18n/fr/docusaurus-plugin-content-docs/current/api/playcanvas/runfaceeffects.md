---
sidebar_label: runFaceEffects() (obsolète)
---

# XR8.PlayCanvas.runFaceEffects() (obsolète)

`XR8.PlayCanvas.runFaceEffects( {pcCamera, pcApp}, [extraModules], config )`

## Description {#description}

Ouvre la caméra et lance l'exécution du suivi du monde XR et/ou des images cible dans une scène PlayCanvas.

## Paramètres {#parameters}

| Paramètres                | Description                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| pcCamera                  | La caméra de scène PlayCanvas pour conduire avec la AR.                   |
| pcApp                     | L'application PlayCanvas, généralement `this.app`.                        |
| extraModules [Facultatif] | Un ensemble optionnel de modules de pipeline supplémentaires à installer. |
| config                    | Paramètres de configuration à transmettre à [`XR8.run()`](/api/xr8/run)   |

`config` est un objet ayant les propriétés suivantes :

| Propriété                               | Type                                                                                      | Défaut                                    | Description                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| support                                 | [`HTMLCanvasElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) |                                           | Le canevas HTML sur lequel le flux de la caméra sera dessiné. Il s'agit généralement de "application-canvas".                                                                                                                                                                                                                                                    |
| webgl2 [Facultatif]                     | `Booléen`                                                                                 | `faux`                                    | Si vrai, utilisez WebGL2 si disponible, sinon utilisez WebGL1.  Si faux, utilisez toujours WebGL1.                                                                                                                                                                                                                                                               |
| ownRunLoop [Facultatif]                 | `Booléen`                                                                                 | `faux`                                    | Si c'est le cas, XR doit utiliser sa propre boucle d'exécution.  Si c'est faux, vous fournirez votre propre boucle d'exécution et serez responsable de l'appel de [`XR8.runPreRender()`](/api/xr8/runprerender) et [`XR8.runPostRender()`](/api/xr8/runpostrender) vous-même [Utilisateurs avancés uniquement]                                                   |
| cameraConfig : {direction} [Facultatif] | `Objet`                                                                                   | `{direction: XR8.XrConfig.camera().BACK}` | Appareil photo souhaité. Les valeurs prises en charge pour la direction `` sont `XR8.XrConfig.camera().BACK` ou `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                    |
| glContextConfig [Facultatif]            | `WebGLContextAttributes`                                                                  | `nul`                                     | Les attributs permettant de configurer le contexte du support WebGL.                                                                                                                                                                                                                                                                                             |
| allowedDevices [Facultatif]             | [`XR8.XrConfig.device()`](/api/xrconfig/device)                                           | `XR8.XrConfig.device().MOBILE`            | Spécifiez la classe d'appareils sur lesquels le pipeline doit fonctionner.  Si l'appareil actuel ne fait pas partie de cette classe, l'exécution échouera avant l'ouverture de la caméra. Si allowedDevices est `XR8.XrConfig.device().ANY`, ouvrez toujours la caméra. Notez que le suivi du monde ne peut être utilisé qu'avec `XR8.XrConfig.device().MOBILE`. |

## Retours {#returns}

Aucun
