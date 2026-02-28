---
id: coaching-overlays
---

# Superposition de l'entraînement

Les incrustations de coaching vous permettent d'intégrer les utilisateurs et de leur garantir une expérience optimale.

## Recouvrement de l'échelle absolue {#absolute-scale-coaching-overlay}

La superposition d'entraînement à l'échelle absolue permet aux utilisateurs de s'initier à l'échelle absolue en s'assurant qu'ils recueillent les meilleures données possibles pour déterminer l'échelle. Nous avons conçu le Coaching Overlay pour qu'il soit facilement personnalisable par les développeurs, ce qui vous permet de vous concentrer sur la création de votre expérience WebAR.

### Utilisez la superposition d'échelle absolue dans votre projet : {#use-absolute-scale-coaching-overlay-in-your-project}

1. Ouvrez votre projet
2. Ajoutez la balise suivante à `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay"&gt ;
```

Remarque : pour les projets auto-hébergés, vous devez ajouter la balise `<script>` à votre page :

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script&gt ;
```

3. En option, personnalisez les paramètres de votre composant `coaching-overlay` comme défini ci-dessous. Pour les projets Non-AFrame, veuillez vous référer à la [documentation](/api/coachingoverlay/configure) CoachingOverlay.configure().

### Paramètres du composant A-Frame (tous facultatifs) {#absolute-scale-coaching-overlay-parameters}

| Paramètres          | Type      | Défaut                                               | Description                                                                                                                                                                      |
| ------------------- | --------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| couleur d'animation | `Chaîne`  | `blanc`                                              | Couleur de l'animation de la superposition d'entraînement. Ce paramètre accepte les arguments de couleur CSS valides.                                                            |
| couleur de l'invite | `Chaîne`  | `blanc`                                              | Couleur de l'ensemble du texte de la superposition d'accompagnement. Ce paramètre accepte les arguments de couleur CSS valides.                                                  |
| texte de l'invite   | `Chaîne`  | `déplacer l'appareil vers l'avant et vers l'arrière` | Définit la chaîne de texte pour le texte explicatif de l'animation qui informe les utilisateurs du mouvement qu'ils doivent effectuer pour générer l'échelle.                    |
| disablePrompt       | `Booléen` | `faux`                                               | La valeur vrai permet de masquer la superposition d'entraînement par défaut afin d'utiliser les événements de superposition d'entraînement pour une superposition personnalisée. |

### Créer une superposition de coaching personnalisée pour votre projet {#custom-absolute-scale-coaching-overlay}

Coaching Overlay peut être ajouté en tant que module de pipeline, puis masqué (à l'aide du paramètre `disablePrompt` ) afin que vous puissiez facilement utiliser les événements de Coaching Overlay pour déclencher une superposition personnalisée.

Les événements de superposition de coaching ne sont déclenchés que lorsque l'échelle `` est réglée sur `absolute`. Les événements sont émis par la boucle d'exécution de la caméra 8th Wall et peuvent être écoutés à partir d'un module de pipeline.  Ces événements incluent :

* `coaching-overlay.show`: l'événement est déclenché lorsque la superposition d'entraînement doit être affichée.
* `coaching-overlay.hide`: l'événement est déclenché lorsque la superposition d'entraînement doit être masquée.

#### Exemple - Superposition d'entraîneurs avec des paramètres spécifiés par l'utilisateur {#example---coaching-overlay-with-user-specified-parameters}

![coachingoverlay-exemple](/images/coachingoverlay-example.jpg)

#### Exemple de cadre A (capture d'écran ci-dessus) {#a-frame-example-screenshot-above}

```jsx
<a-scene
  coaching-overlay="
    animationColor: #E86FFF;
    promptText: To generate scale push your phone forward and then pull back;"
  xrextras-loading
  xrextras-gesture-detector
  ...
  xrweb="scale: absolute;">
```

#### Exemple sans cadre (capture d'écran ci-dessus) {#non-aframe-example--screenshot-above}

```jsx
// Configuré ici
CoachingOverlay.configure({
    animationColor : '#E86FFF',
    promptText : 'To generate scale push your phone forward and then pull back',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  LandingPage.pipelineModule(),
  // Ajouté ici
  CoachingOverlay.pipelineModule(),
  ...
])
```

#### Exemple d'AFrame - Écoute des événements de la superposition de coaching {#aframe-example---listening-for-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('coaching-overlay.show', () => {
  // Faites quelque chose
 })

this.el.sceneEl.addEventListener('coaching-overlay.hide', () => {
  // Faites quelque chose
})
```

#### Exemple sans cadre - Écoute des événements de superposition de coaching {#non-aframe-example---listening-for-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EXEMPLE : COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EXEMPLE : COACHING OVERLAY - HIDE')
}

const myPipelineModule = {
  name : 'my-coaching-overlay',
  listeners : [
    {event: 'coaching-overlay.show', process: myShow},
    {event: 'coaching-overlay.hide', process: myHide},
  ],
}

const onxrloaded = () => {
  XR8.addCameraPipelineModule(myPipelineModule)
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```


## VPS Coaching Overlay {#vps-coaching-overlay}

La superposition d'entraînement VPS permet aux utilisateurs de vivre des expériences VPS en s'assurant qu'ils se trouvent bien dans des lieux réels. Nous avons conçu le Coaching Overlay pour qu'il soit facilement personnalisable par les développeurs de , ce qui vous permet de vous concentrer sur la création de votre expérience WebAR.

### Utilisez la superposition de l'entraînement VPS dans votre projet : {#use-vps-coaching-overlay-in-your-project}

1. Ouvrez votre projet
2. Ajoutez la balise suivante à `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay"&gt ;
```

Remarque : pour les projets auto-hébergés, vous devez ajouter la balise `<script>` à votre page :

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script&gt ;
```

3. En option, personnalisez les paramètres de votre composant `coaching-overlay` comme défini ci-dessous.  Pour les projets Non-AFrame, veuillez vous référer à la documentation [VpsCoachingOverlay.configure()](/api/vpscoachingoverlay/vps-coachingoverlay-configure) .

### Paramètres du composant A-Frame (tous facultatifs) {#vps-coaching-overlay-parameters}

| Paramètres              | Type      | Défaut                             | Description                                                                                                                                                                                                                                                                                                 |
| ----------------------- | --------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nom du point de passage | `Chaîne`  |                                    | Le nom de l'endroit où la superposition d'accompagnement guide l'utilisateur pour qu'il se localise. Si aucun nom d'emplacement n'est spécifié, il utilisera l'emplacement de projet le plus proche. Si le projet n'a pas d'emplacement de projet, il utilisera l'emplacement le plus proche.               |
| image secondaire        | `Chaîne`  |                                    | Image affichée à l'utilisateur pour le guider vers le lieu réel. Si aucune image secondaire n'est spécifiée, l'image par défaut de l'emplacement sera utilisée. Si l'emplacement n'a pas d'image par défaut, aucune image ne sera affichée. Les sources de média acceptées sont l'id img ou l'URL statique. |
| animation-couleur       | `Chaîne`  | `'#ffffff'`                        | Couleur de l'animation de la superposition d'entraînement. Ce paramètre accepte les arguments de couleur CSS valides.                                                                                                                                                                                       |
| durée de l'animation    | `Nombre`  | `5000`                             | Durée totale d'affichage de l'image de l'indice avant son rétrécissement (en millisecondes).                                                                                                                                                                                                                |
| couleur de l'invite     | `Chaîne`  | `'#ffffff'`                        | Couleur de l'ensemble du texte de la superposition d'accompagnement. Ce paramètre accepte les arguments de couleur CSS valides.                                                                                                                                                                             |
| préfixe de l'invite     | `Chaîne`  | `pointez votre appareil photo sur` | Définit la chaîne de texte pour l'action utilisateur conseillée au-dessus du nom de l'emplacement.                                                                                                                                                                                                          |
| invite-suffixe          | `Chaîne`  | `et se déplacer`                   | Définit la chaîne de texte pour l'action utilisateur conseillée sous le nom de l'emplacement.                                                                                                                                                                                                               |
| texte de l'état         | `Chaîne`  | `'Scanner...'`                     | Définit la chaîne de texte qui s'affiche sous l'image secondaire lorsqu'elle est réduite.                                                                                                                                                                                                                   |
| désactiver l'invite     | `Booléen` | `faux`                             | La valeur vrai permet de masquer la superposition d'entraînement par défaut afin d'utiliser les événements de superposition d'entraînement pour une superposition personnalisée.                                                                                                                            |

### Créer une superposition de coaching personnalisée pour votre projet {#custom-vps-coaching-overlay}

Coaching Overlay peut être ajouté en tant que module de pipeline, puis masqué (à l'aide du paramètre `disablePrompt` ) afin que vous puissiez facilement utiliser les événements de Coaching Overlay pour déclencher une superposition personnalisée.

Les événements VPS Coaching Overlay ne sont déclenchés que lorsque `enableVps` est réglé sur `vrai`. Les événements sont émis par la boucle d'exécution de la caméra 8th Wall et peuvent être écoutés à partir d'un module de pipeline.  Ces événements comprennent :

* `vps-coaching-overlay.show`: l'événement est déclenché lorsque le Coaching Overlay doit être affiché.
* `vps-coaching-overlay.hide`: l'événement est déclenché lorsque le Coaching Overlay doit être masqué.

#### Exemple - Superposition d'entraîneurs avec des paramètres spécifiés par l'utilisateur {#example---coaching-overlay-with-user-specified-parameters}

![vps-coachingoverlay-exemple](/images/vps-coaching-overlay-example.jpg)

#### Exemple de cadre A (capture d'écran ci-dessus) {#a-frame-example-screenshot-above}

```html
<a-scene
  vps-coaching-overlay="
    prompt-color: #0000FF;
    prompt-prefix: Go look for;"
  xrextras-loading
  xrextras-gesture-detector
  ...
  xrweb="vpsEnabled: true;">
```

#### Exemple sans cadre (capture d'écran ci-dessus) {#non-aframe-example--screenshot-above}

```javascript
// Configuré ici
VpsCoachingOverlay.configure({
    textColor : '#0000FF',
    promptPrefix : 'Go look for',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  LandingPage.pipelineModule(),
  // Ajouté ici
  VpsCoachingOverlay.pipelineModule(),
  ...
])

```

#### Exemple d'AFrame - Écoute des événements de superposition de coaching VPS {#aframe-example---listening-for-vps-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('vps-coaching-overlay.show', () => {
  // Faites quelque chose
 })

this.el.sceneEl.addEventListener('vps-coaching-overlay.hide', () => {
  // Faites quelque chose
})
```

#### Exemple hors cadre - Écoute des événements de superposition de coaching du SPV {#non-aframe-example---listening-for-vps-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EXEMPLE : VPS COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EXEMPLE : VPS COACHING OVERLAY - HIDE')
}

const myPipelineModule = {
  name : 'my-coaching-overlay',
  listeners : [
    {event: 'vps-coaching-overlay.show', process: myShow},
    {event: 'vps-coaching-overlay.hide', process: myHide},
  ],
}

const onxrloaded = () => {
  XR8.addCameraPipelineModule(myPipelineModule)
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```

## Superposition de coaching avec effets de ciel {#sky-effects-coaching-overlay}

La superposition d’entraînement avec effet de ciel permet aux utilisateurs de découvrir Sky Effects en s'assurant qu'ils pointent leur appareil vers le ciel. Nous avons conçu le Coaching Overlay de manière à ce qu'il soit facilement personnalisable par les développeurs, , ce qui vous permet de vous concentrer sur la création de votre expérience WebAR.

**Remarque : les effets de ciel ne peuvent actuellement pas être visualisés sur le simulateur [](/getting-started/quick-start-guide/#simulator).**

### Utilisez la superposition d'effets de ciel dans votre projet {#use-sky-effects-coaching-overlay-in-your-project}

1. Ouvrez votre projet
2. Ajoutez la balise suivante à `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay"&gt ;
```

Remarque : pour les projets auto-hébergés, vous devez ajouter la balise `<script>` à votre page :

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script&gt ;
```

3. En option, personnalisez les paramètres de votre composant `sky-coaching-overlay` comme défini ci-dessous. Pour les projets non-AFrame, veuillez vous référer à la rubrique
<!-- TODO (tri) API link doesn't exist, remove/replace it -->
 [SkyCoachingOverlay.configure()](#skycoachingoverlayconfigure) documentation.

### Paramètres du composant A-Frame (tous facultatifs) {#sky-coaching-overlay-parameters}

| Paramètres          | Type      | Défaut                                 | Description                                                                                                                                                                      |
| ------------------- | --------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| couleur d'animation | `Chaîne`  | `blanc`                                | Couleur de l'animation de la superposition d'entraînement. Ce paramètre accepte les arguments de couleur CSS valides.                                                            |
| couleur de l'invite | `Chaîne`  | `blanc`                                | Couleur de l'ensemble du texte de la superposition d'accompagnement. Ce paramètre accepte les arguments de couleur CSS valides.                                                  |
| texte de l'invite   | `Chaîne`  | `pointez votre téléphone vers le ciel` | Définit la chaîne de texte pour le texte explicatif de l'animation qui informe les utilisateurs du mouvement qu'ils doivent effectuer.                                           |
| disablePrompt       | `Booléen` | `faux`                                 | La valeur vrai permet de masquer la superposition d'entraînement par défaut afin d'utiliser les événements de superposition d'entraînement pour une superposition personnalisée. |
| autoByThreshold     | `Booléen` | `vrai`                                 | Afficher/masquer automatiquement la superposition en fonction du pourcentage du pixel du ciel supérieur/inférieur à `hideThreshold` / `showThreshold`                            |
| showThreshold       | `Nombre`  | 0.1                                    | Affichez un recouvrement actuellement caché si le pourcentage de pixels du ciel est inférieur à ce seuil.                                                                        |
| seuil de masquage   | `Nombre`  | 0.05                                   | Masquer un recouvrement actuellement affiché si le pourcentage du pixel du ciel est supérieur à ce seuil.                                                                        |

### Créer une superposition de coaching personnalisée pour votre projet {#custom-sky-coaching-overlay}

Superposition de coaching avec ciel peut être ajouté en tant que module de pipeline, puis masqué (à l'aide du paramètre `disablePrompt` ) afin que vous puissiez facilement utiliser les événements de superposition de coaching pour déclencher une superposition personnalisée.

* `sky-coaching-overlay.show`: l'événement est déclenché lorsque la superposition de coaching doit être affichée.
* `sky-coaching-overlay.hide`: l'événement est déclenché lorsque la superposition de coaching doit être cachée.


**SkyCoachingOverlay.control**

Par défaut, la superposition de coaching avec effets de ciel affiche et masque automatiquement la superposition selon que l'utilisateur regarde le ciel ou non. Vous pouvez contrôler ce comportement en utilisant `SkyCoachingOverlay.control`.

```javascript
// Affichez la couche de coaching
SkyCoachingOverlay.control.show()
// Cachez la couche de coaching
SkyCoachingOverlay.control.hide()
// Faites en sorte que la couche de coaching du ciel s'affiche / se cache automatiquement.
SkyCoachingOverlay.control.setAutoShowHide(true)
// Faites en sorte que la superposition de coaching dans le ciel ne s'affiche pas / ne se cache pas automatiquement.
SkyCoachingOverlay.control.setAutoShowHide(false)
// Masque la superposition d'entraînement et la nettoie
SkyCoachingOverlay.control.cleanup()
```

Par exemple, une partie de votre expérience pourrait ne plus nécessiter que l'utilisateur regarde le ciel. Si vous n'appelez pas `setAutoShowHide(false)`, la couche de coaching apparaîtra au-dessus de votre interface utilisateur. Dans ce cas, appelez `setAutoShowHide(false)`, puis contrôlez manuellement l'affichage et le masquage en utilisant `show()` et `hide()`. Ou lorsque vous êtes prêt à demander à l'utilisateur de regarder à nouveau le ciel, `setAutoShowHide(true)`.


#### Exemple - Superposition de la couverture du ciel avec des paramètres spécifiés par l'utilisateur {#example---sky-coaching-overlay-with-user-specified-parameters}

![sky-coachingoverlay-exemple](/images/sky-coachingoverlay-example.jpg)

#### Exemple de cadre A (capture d'écran ci-dessus) {#a-frame-example-screenshot-above}

```html
<a-scene
  ...
  xrlayers="cameraDirection : back ;"
  sky-coaching-overlay="
    animationColor : #E86FFF ;
    promptText : Regardez le ciel! ;"
  ...
  renderer="colorManagement : true"
>
```

#### Exemple sans cadre (capture d'écran ci-dessus) {#non-aframe-example--screenshot-above}

```javascript
// Configuré ici
SkyCoachingOverlay.configure({
    animationColor : '#E86FFF',
    promptText : 'Look at the sky!!',
})
XR8.addCameraPipelineModules([ // Ajouter les modules du pipeline de la caméra.
    // Modules de pipeline existants.
    XR8.GlTextureRenderer.pipelineModule(), // Dessine le flux de la caméra.
    XR8.Threejs.pipelineModule(), // Crée une scène AR ThreeJS ainsi qu'une scène Sky.
    window.LandingPage.pipelineModule(), // Détecte les navigateurs non pris en charge et donne des conseils.
    XRExtras.FullWindowCanvas.pipelineModule(), // Modifie le canevas pour remplir la fenêtre.
    XRExtras.Loading.pipelineModule(), // Gère l'écran de chargement au démarrage.
    XRExtras.RuntimeError.pipelineModule(), // Affiche une image d'erreur en cas d'erreur d'exécution.

    // Active la segmentation du ciel.
    XR8.LayersController.pipelineModule(),
    SkyCoachingOverlay.pipelineModule(),

    ...
    mySkySampleScenePipelineModule(),
  ])

  XR8.LayersController.configure({layers: {sky: {invertLayerMask: false}}})
  XR8.Threejs.configure({layerScenes: ['sky']})

```

#### Exemple d'AFrame - Écoute des événements de la superposition Sky Coaching {#aframe-example---listening-for-sky-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('sky-coaching-overlay.show', () => {
  // Faites quelque chose
 })

this.el.sceneEl.addEventListener('sky-coaching-overlay.hide', () => {
  // Faites quelque chose
})
```

#### Exemple sans cadre - Écoute des événements de la superposition Sky Coaching {#non-aframe-example---listening-for-sky-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EXEMPLE : SKY COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EXEMPLE : SKY COACHING OVERLAY - HIDE')
}

const myPipelineModule = {
  name : 'my-sky-coaching-overlay',
  listeners : [
    {event: 'sky-coaching-overlay.show', process: myShow},
    {event: 'sky-coaching-overlay.hide', process: myHide},
  ],
}

const onxrloaded = () => {
  XR8.addCameraPipelineModule(myPipelineModule)
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```

## Superposition de coaching avec suivi de la main {#hand-tracking-coaching-overlay}

La superposition d'entraînement pour le suivi de la main permet aux utilisateurs de s'initier au suivi de la main en s'assurant qu'ils pointent leur téléphone vers une main. Nous avons conçu la superposition de coaching de manière à ce qu'il soit facilement personnalisable par les développeurs, , ce qui vous permet de vous concentrer sur la création de votre expérience WebAR.

### Utilisez l'incrustation de coaching de suivi de main dans votre projet {#use-hand-tracking-coaching-overlay-in-your-project}

1. Ouvrez votre projet
2. Ajoutez la balise suivante à `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay"&gt ;
```

Remarque : pour les projets auto-hébergés, vous devez ajouter la balise `<script>` à votre page :

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script&gt ;
```

3. En option, personnalisez les paramètres de votre composant `hand-coaching-overlay` comme défini ci-dessous. Pour les projets non-AFrame, veuillez vous référer à la rubrique
<!-- TODO (tri) API link doesn't exist, remove/replace it -->
 [HandCoachingOverlay.configure()](#handcoachingoverlayconfigure) documentation.

### Paramètres du composant A-Frame (tous facultatifs) {#hand-coaching-overlay-parameters}

| Paramètres          | Type      | Défaut                                    | Description                                                                                                                                                                      |
| ------------------- | --------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| couleur d'animation | `Chaîne`  | `blanc`                                   | Couleur de l'animation de la superposition d'entraînement. Ce paramètre accepte les arguments de couleur CSS valides.                                                            |
| couleur de l'invite | `Chaîne`  | `blanc`                                   | Couleur de l'ensemble du texte de la superposition d'accompagnement. Ce paramètre accepte les arguments de couleur CSS valides.                                                  |
| texte de l'invite   | `Chaîne`  | `pointez votre téléphone vers votre main` | Définit la chaîne de texte pour le texte explicatif de l'animation qui informe les utilisateurs du mouvement qu'ils doivent effectuer.                                           |
| disablePrompt       | `Booléen` | `faux`                                    | La valeur vrai permet de masquer la superposition d'entraînement par défaut afin d'utiliser les événements de superposition d'entraînement pour une superposition personnalisée. |


### Créer une superposition de coaching personnalisée pour votre projet {#custom-hand-coaching-overlay}

Superposition de coaching sur main peut être ajouté en tant que module de pipeline, puis masqué (à l'aide du paramètre `disablePrompt` ) afin que vous puissiez facilement utiliser les événements de superposition de coaching pour déclencher une superposition personnalisée.

* `hand-coaching-overlay.show`: l'événement est déclenché lorsque la superposition de coaching doit être affichée.
* `hand-coaching-overlay.hide`: l'événement est déclenché lorsque la superposition de coaching doit être masquée.


#### Exemple - Superposition de coaching sur main avec des paramètres spécifiés par l'utilisateur {#example---hand-coaching-overlay-with-user-specified-parameters}

![hand-coachingoverlay-exemple](/images/hand-coaching-overlay-example.jpeg)

#### Exemple de cadre A (capture d'écran ci-dessus) {#a-frame-example-screenshot-above}

```html
<a-scene
  ...
  xrhand="allowedDevices:any ; cameraDirection:back ;"
  hand-coaching-overlay="
    animationColor : #E86FFF ;
    promptText : Dirigez le téléphone vers votre main gauche ! ;"
  ...
  renderer="colorManagement : true"
>
```

#### Exemple sans cadre (capture d'écran ci-dessus) {#non-aframe-example--screenshot-above}

```javascript
// Configuré ici
HandCoachingOverlay.configure({
    animationColor : '#E86FFF',
    promptText : 'Pointez le téléphone vers votre main gauche!',
})
XR8.addCameraPipelineModules([ // Ajoutez les modules du pipeline de la caméra.
    // Modules de pipeline existants.
    XR8.GlTextureRenderer.pipelineModule(), // Dessine le flux de la caméra.
    XR8.Threejs.pipelineModule(), // Crée une scène AR ThreeJS ainsi qu'une scène Sky.
    window.LandingPage.pipelineModule(), // Détecte les navigateurs non pris en charge et donne des conseils.
    XRExtras.FullWindowCanvas.pipelineModule(), // Modifie le canevas pour remplir la fenêtre.
    XRExtras.Loading.pipelineModule(), // Gère l'écran de chargement au démarrage.
    XRExtras.RuntimeError.pipelineModule(), // Affiche une image d'erreur en cas d'erreur d'exécution.

    // Active le suivi des mains.
    XR8.HandController.pipelineModule(),
    HandCoachingOverlay.pipelineModule(),

    ...
    myHandSampleScenePipelineModule(),
  ])

```

#### Exemple d'AFrame - Écoute des événements de superposition du coaching de main {#aframe-example---listening-for-hand-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('hand-coaching-overlay.show', () => {
  // Faites quelque chose
 })

this.el.sceneEl.addEventListener('hand-coaching-overlay.hide', () => {
  // Faites quelque chose
})
```

#### Exemple sans cadre - Écoute des événements de superposition de coaching sur main {#non-aframe-example---listening-for-hand-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EXEMPLE : HAND COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EXEMPLE : HAND COACHING OVERLAY - HIDE')
}

const myPipelineModule = {
  name : 'my-hand-coaching-overlay',
  listeners : [
    {event: 'hand-coaching-overlay.show', process: myShow},
    {event: 'hand-coaching-overlay.hide', process: myHide},
  ],
}

const onxrloaded = () => {
  XR8.addCameraPipelineModule(myPipelineModule)
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```
