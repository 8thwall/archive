---
sidebar_label: run()
---

# XR8.PlayCanvas.run()

`XR8.PlayCanvas.run( {pcCamera, pcApp}, [extraModules], config )`

## Description {#description}

Ajoute les modules de pipeline spécifiés et ouvre ensuite la caméra.

## Paramètres {#parameters}

| Paramètres                | Type                                                                                    | Description                                                                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| pcCamera                  | [`pc.CameraComponent`](https://developer.playcanvas.com/en/api/pc.CameraComponent.html) | La caméra de scène PlayCanvas pour conduire avec la AR.                                                                                           |
| pcApp                     | [`pc.Application`](https://developer.playcanvas.com/en/api/pc.Application.html)         | L'application PlayCanvas, généralement `this.app`.                                                                                                |
| extraModules [Facultatif] | `[Object]`                                                                              | Un ensemble optionnel de modules de pipeline supplémentaires à installer.                                                                         |
| config                    | `{canvas, webgl2, ownRunLoop, cameraConfig, glContextConfig, allowedDevices, layers}`   | Paramètres de configuration à transmettre à [`XR8.run()`](/api/xr8/run) ainsi que la configuration spécifique à PlayCanvas, par exemple `layers`. |

`config` est un objet ayant les propriétés suivantes :

| Propriété                               | Type                                                                                      | Défaut                                    | Description                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| support                                 | [`HTMLCanvasElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) |                                           | Le canevas HTML sur lequel le flux de la caméra sera dessiné. Il s'agit généralement de `document.getElementById('application-canvas')`.                                                                                                                                                                                                                         |
| webgl2 [Facultatif]                     | `Booléen`                                                                                 | `faux`                                    | Si vrai, utilisez WebGL2 si disponible, sinon utilisez WebGL1.  Si faux, utilisez toujours WebGL1.                                                                                                                                                                                                                                                               |
| ownRunLoop [Facultatif]                 | `Booléen`                                                                                 | `faux`                                    | Si c'est le cas, XR doit utiliser sa propre boucle d'exécution.  Si c'est faux, vous fournirez votre propre boucle d'exécution et serez responsable de l'appel de [`XR8.runPreRender()`](/api/xr8/runprerender) et [`XR8.runPostRender()`](/api/xr8/runpostrender) vous-même [Utilisateurs avancés uniquement]                                                   |
| cameraConfig : {direction} [Facultatif] | `Objet`                                                                                   | `{direction: XR8.XrConfig.camera().BACK}` | Appareil photo souhaité. Les valeurs prises en charge pour la direction `` sont `XR8.XrConfig.camera().BACK` ou `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                    |
| glContextConfig [Facultatif]            | `WebGLContextAttributes`                                                                  | `nul`                                     | Les attributs permettant de configurer le contexte du support WebGL.                                                                                                                                                                                                                                                                                             |
| allowedDevices [Facultatif]             | [`XR8.XrConfig.device()`](/api/xrconfig/device)                                           | `XR8.XrConfig.device().MOBILE`            | Spécifiez la classe d'appareils sur lesquels le pipeline doit fonctionner.  Si l'appareil actuel ne fait pas partie de cette classe, l'exécution échouera avant l'ouverture de la caméra. Si allowedDevices est `XR8.XrConfig.device().ANY`, ouvrez toujours la caméra. Notez que le suivi du monde ne peut être utilisé qu'avec `XR8.XrConfig.device().MOBILE`. |
| couches [Facultatif]                    | `[]`                                                                                      | `[]`                                      | Spécifiez la liste des couches à dessiner en utilisant `GlTextureRenderer`. La clé est le nom du calque dans 8th Wall, et la valeur est une liste de noms de calques PlayCanvas que nous devons rendre dans une texture et un masque en utilisant le calque 8th Wall. Exemple de valeur : `{"sky": ["FirstSkyLayer", "SecondSkyLayer"]}`.                        |

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
var layercontroller = pc.createScript('layercontroller')

layercontroller.prototype.initialize = function() {
  // Après le chargement complet de XR, ouvrez le flux de la caméra et commencez à afficher l'AR.
  const runOnLoad = ({pcCamera, pcApp}, extramodules) => () => {
    // Passez le nom de votre toile. Il s'agit généralement de "application-canvas".
    const config = {
      canvas : document.getElementById('application-canvas'),
      layers : {"sky": ["Sky"]}
    }
    XR8.PlayCanvas.run({pcCamera, pcApp}, extraModules, config)
  }

  // Trouvez la caméra dans la scène PlayCanvas et liez-la au mouvement du téléphone de l'utilisateur dans le // monde
  .
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
    XR8.LayersController.pipelineModule(), // Ajoute la prise en charge des effets de ciel.
  ])})
}
```
