---
sidebar_label: runXr() (obsolète)
---

# XR8.PlayCanvas.runXr() (obsolète)

`XR8.PlayCanvas.runXr( {pcCamera, pcApp}, [extraModules], config )`

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

## Exemple {#example}

```javascript
var xrcontroller = pc.createScript('xrcontroller')

// En option, le suivi du monde peut être désactivé pour augmenter l'efficacité du suivi des images cibles.
xrcontroller.attributes.add('disableWorldTracking', {type: 'Boolean'})

xrcontroller.prototype.initialize = function() {
  const disableWorldTracking = this.disableWorldTracking

  // Après le chargement complet du XR, ouvrez le flux de la caméra et commencez à afficher l'AR.
  const runOnLoad = ({pcCamera, pcApp}, extramodules) => () => {
    XR8.xrController().configure({disableWorldTracking})
    // Passez le nom de votre support. Il s'agit généralement de "application-canvas".
    const config = {canvas: document.getElementById('application-canvas') }
    XR8.PlayCanvas.runXr({pcCamera, pcApp}, extraModules, config)
  }

  // Trouvez la caméra dans la scène PlayCanvas et liez-la au mouvement du téléphone de l'utilisateur dans le
  // monde.
  const pcCamera = XRExtras.PlayCanvas.findOneCamera(this.entity)

  // Pendant que XR est encore en train de charger, affichez quelques éléments utiles.
  // On y est presque : Détermine si l'environnement de l'utilisateur peut prendre en charge le web ar et, si ce n'est pas le cas,
  // affiche des conseils sur la manière de visualiser l'expérience.
  // Chargement : demande l'autorisation de la caméra et cache la scène jusqu'à ce qu'elle soit prête à être affichée.
  // Erreur d’exécution : Si un problème inattendu survient, affichez un écran d'erreur.
  XRExtras.Loading.showLoading({onxrloaded: runOnLoad({pcCamera, pcApp: this.app}, [
    // Modules optionnels que les développeurs peuvent souhaiter personnaliser ou thématiser.
    XRExtras.AlmostThere.pipelineModule(), // Détecte les navigateurs non supportés et donne des conseils.
    XRExtras.Loading.pipelineModule(), // Gère l'écran de chargement au démarrage.
    XRExtras.RuntimeError.pipelineModule(), // Affiche une image d'erreur en cas d'erreur d'exécution.
  ])})
}
```
