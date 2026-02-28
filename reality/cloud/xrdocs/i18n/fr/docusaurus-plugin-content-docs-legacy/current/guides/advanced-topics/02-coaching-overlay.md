---
id: coaching-overlays
---

# Superposition de l'entraînement

Les incrustations de coaching vous permettent d'intégrer les utilisateurs et de leur garantir une expérience optimale.

## Écart absolu de l'échelle Recouvrement de l'encadrement {#absolute-scale-coaching-overlay}

La superposition d'entraînement à l'échelle absolue permet aux utilisateurs de s'initier à l'échelle absolue en s'assurant qu'ils recueillent les
meilleures données possibles pour déterminer l'échelle. Nous avons conçu le Coaching Overlay pour qu'il soit facilement
personnalisable par les développeurs, ce qui vous permet de vous concentrer sur la création de votre expérience WebAR.

### Utilisez la superposition d'échelle absolue dans votre projet : {#use-absolute-scale-coaching-overlay-in-your-project}

1. Ouvrez votre projet
2. Ajoutez la balise suivante à `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Note : Pour les projets auto-hébergés, vous devez ajouter la balise `<script>` à votre page :

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Si vous le souhaitez, vous pouvez personnaliser les paramètres de votre composant `coaching-overlay` comme défini ci-dessous. Pour les projets
   Non-AFrame, veuillez vous référer à la documentation
   [CoachingOverlay.configure()](/legacy/api/coachingoverlay/configure).

### Paramètres du composant A-Frame (tous facultatifs) {#absolute-scale-coaching-overlay-parameters}

| Paramètres          | Type      | Défaut                                                                | Description                                                                                                                                                                                        |
| ------------------- | --------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| couleur d'animation | `Chaîne`  | \\`'blanc''                                                          | Couleur de l'animation de la superposition d'entraînement. Ce paramètre accepte les arguments de couleur CSS valides.                                              |
| couleur de l'invite | `Chaîne`  | \\`'blanc''                                                          | Couleur de l'ensemble du texte de la superposition d'accompagnement. Ce paramètre accepte les arguments de couleur CSS valides.                                    |
| texte de l'invite   | `Chaîne`  | `Déplacer l'appareil vers l'avant et vers l'arrière`. | Définit la chaîne de texte pour le texte explicatif de l'animation qui informe les utilisateurs du mouvement qu'ils doivent effectuer pour générer l'échelle.                      |
| disablePrompt       | `Booléen` | `false`                                                               | La valeur "true" permet de masquer la superposition d'entraînement par défaut afin d'utiliser les événements de superposition d'entraînement pour une superposition personnalisée. |

### Créer une superposition de coaching personnalisée pour votre projet {#custom-absolute-scale-coaching-overlay}

Coaching Overlay peut être ajouté en tant que module de pipeline et ensuite caché (en utilisant le paramètre `disablePrompt`
) afin que vous puissiez facilement utiliser les événements de Coaching Overlay pour déclencher une superposition personnalisée.

Les événements de superposition de couverture ne sont déclenchés que lorsque `scale` est réglé sur `absolute`. Les événements sont émis par la boucle d'exécution de la caméra
8th Wall et peuvent être écoutés à partir d'un module de pipeline.  Ces événements
incluent :

- `coaching-overlay.show` : l'événement est déclenché lorsque le Coaching Overlay doit être affiché.
- `coaching-overlay.hide` : l'événement est déclenché lorsque la superposition d'entraînement doit être cachée.

#### Exemple - Superposition d'entraîneurs avec des paramètres spécifiés par l'utilisateur {#example---coaching-overlay-with-user-specified-parameters}

![coachingoverlay-example](/images/coachingoverlay-example.jpg)

#### Exemple de cadre A (capture d'écran ci-dessus) {#a-frame-example-screenshot-above}

```jsx
<a-scene
  coaching-overlay="
    animationColor : #E86FFF ;
    promptText : Pour générer l'échelle, poussez votre téléphone vers l'avant puis tirez vers l'arrière ;"
  xrextras-loading
  xrextras-gesture-detector
  ...
  xrweb="scale : absolute ;">
```

#### Exemple hors cadre (capture d'écran ci-dessus) {#non-aframe-example--screenshot-above}

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

#### Exemple d'AFrame - Écoute des événements de coaching superposés {#aframe-example---listening-for-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('coaching-overlay.show', () => {
  // Faire quelque chose
 })

this.el.sceneEl.addEventListener('coaching-overlay.hide', () => {
  // Faire quelque chose
})
```

#### Exemple sans cadre - Écoute des événements de coaching superposés {#non-aframe-example---listening-for-coaching-overlay-events}

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

La superposition d'entraînement VPS permet aux utilisateurs de vivre des expériences VPS en s'assurant qu'ils localisent correctement
dans des lieux réels. Nous avons conçu le Coaching Overlay pour qu'il soit facilement personnalisable par les développeurs de
, ce qui vous permet de vous concentrer sur la création de votre expérience WebAR.

### Utilisez la superposition de l'encadrement VPS dans votre projet : {#use-vps-coaching-overlay-in-your-project}

1. Ouvrez votre projet
2. Ajoutez la balise suivante à `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Note : Pour les projets auto-hébergés, vous devez ajouter la balise `<script>` à votre page :

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Si vous le souhaitez, vous pouvez personnaliser les paramètres de votre composant `coaching-overlay` comme défini ci-dessous.  Pour les projets
   Non-AFrame, veuillez vous référer à la documentation
   [VpsCoachingOverlay.configure()](/legacy/api/vpscoachingoverlay/vps-coachingoverlay-configure).

### Paramètres du composant A-Frame (tous facultatifs) {#vps-coaching-overlay-parameters}

| Paramètres              | Type      | Défaut                                                 | Description                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------- | --------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nom du point de passage | `Chaîne`  |                                                        | Le nom de l'endroit où la superposition d'accompagnement guide l'utilisateur pour qu'il se localise. Si aucun nom d'emplacement n'est spécifié, il utilisera l'emplacement de projet le plus proche. Si le projet n'a pas d'emplacement de projet, il utilisera l'emplacement le plus proche.                               |
| image secondaire        | `Chaîne`  |                                                        | Image affichée à l'utilisateur pour le guider vers le lieu réel. Si aucune image secondaire n'est spécifiée, l'image par défaut de l'emplacement sera utilisée. Si l'emplacement n'a pas d'image par défaut, aucune image ne sera affichée. Les sources de média acceptées sont l'id img ou l'URL statique. |
| animation-couleur       | `Chaîne`  | `'#ffffff'`                                            | Couleur de l'animation de la superposition d'entraînement. Ce paramètre accepte les arguments de couleur CSS valides.                                                                                                                                                                                                                       |
| durée de l'animation    | `Nombre`  | `5000`                                                 | Durée totale d'affichage de l'image de l'indice avant son rétrécissement (en millisecondes).                                                                                                                                                                                                                                             |
| couleur de l'invite     | `Chaîne`  | `'#ffffff'`                                            | Couleur de l'ensemble du texte de la superposition d'accompagnement. Ce paramètre accepte les arguments de couleur CSS valides.                                                                                                                                                                                                             |
| Préfixe de l'invite     | `Chaîne`  | `Pointez votre appareil photo sur'' `. | Définit la chaîne de texte pour l'action utilisateur conseillée au-dessus du nom de l'emplacement.                                                                                                                                                                                                                                                          |
| invite-suffixe          | `Chaîne`  | `"et se déplacer"`                                     | Définit la chaîne de texte pour l'action utilisateur conseillée sous le nom de l'emplacement.                                                                                                                                                                                                                                                               |
| texte du statut         | `Chaîne`  | `Scanning...'`                                         | Définit la chaîne de texte qui s'affiche sous l'image secondaire lorsqu'elle est réduite.                                                                                                                                                                                                                                                                   |
| désactiver l'invite     | `Booléen` | `false`                                                | La valeur "true" permet de masquer la superposition d'entraînement par défaut afin d'utiliser les événements de superposition d'entraînement pour une superposition personnalisée.                                                                                                                                                                          |

### Créer une superposition de coaching personnalisée pour votre projet {#custom-vps-coaching-overlay}

Coaching Overlay peut être ajouté en tant que module de pipeline et ensuite caché (en utilisant le paramètre `disablePrompt`
) afin que vous puissiez facilement utiliser les événements de Coaching Overlay pour déclencher une superposition personnalisée.

Les événements VPS Coaching Overlay ne sont déclenchés que lorsque `enableVps` est réglé sur `true`. Les événements sont
émis par la boucle d'exécution de la caméra 8th Wall et peuvent être écoutés à partir d'un module de pipeline.  Ces événements
comprennent

- `vps-coaching-overlay.show` : l'événement est déclenché lorsque le Coaching Overlay doit être affiché.
- `vps-coaching-overlay.hide` : l'événement est déclenché lorsque le Coaching Overlay doit être caché.

#### Exemple - Superposition d'entraîneurs avec des paramètres spécifiés par l'utilisateur {#example---coaching-overlay-with-user-specified-parameters}

![vps-coachingoverlay-example](/images/vps-coaching-overlay-example.jpg)

#### Exemple de cadre A (capture d'écran ci-dessus) {#a-frame-example-screenshot-above}

```html
<a-scene
  vps-coaching-overlay="
    prompt-color : #0000FF ;
    prompt-prefix : Va chercher ;"
  xrextras-loading
  xrextras-gesture-detector
  ...
  xrweb="vpsEnabled : true ;">
```

#### Exemple hors cadre (capture d'écran ci-dessus) {#non-aframe-example--screenshot-above}

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

#### Exemple d'AFrame - Écoute des événements de la superposition d'accompagnement VPS {#aframe-example---listening-for-vps-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('vps-coaching-overlay.show', () => {
  // Faire quelque chose
 })

this.el.sceneEl.addEventListener('vps-coaching-overlay.hide', () => {
  // Faire quelque chose
})
```

#### Exemple de non-trame - Écoute des événements de la superposition de l'encadrement du SPV {#non-aframe-example---listening-for-vps-coaching-overlay-events}

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

## Superposition de coaching Sky Effects {#sky-effects-coaching-overlay}

La surcouche d'accompagnement Sky Effects permet aux utilisateurs de découvrir Sky Effects en s'assurant qu'ils pointent leur appareil
vers le ciel. Nous avons conçu le Coaching Overlay de manière à ce qu'il soit facilement personnalisable par les développeurs,
, ce qui vous permet de vous concentrer sur la création de votre expérience WebAR.

\*\*Note : Les effets de ciel ne peuvent pas être visualisés dans le [Simulateur]
(/legacy/getting-started/quick-start-guide/#simulator).

### Utilisez la superposition d'effets de ciel dans votre projet {#use-sky-effects-coaching-overlay-in-your-project}

1. Ouvrez votre projet
2. Ajoutez la balise suivante à `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Note : Pour les projets auto-hébergés, vous devez ajouter la balise `<script>` à votre page :

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Si vous le souhaitez, vous pouvez personnaliser les paramètres de votre composant `sky-coaching-overlay` comme défini ci-dessous.
   Pour les projets non-AFrame, veuillez vous référer à la documentation SkyCoachingOverlay.configure().

### Paramètres du composant A-Frame (tous facultatifs) {#sky-coaching-overlay-parameters}

| Paramètres          | Type      | Défaut                                                  | Description                                                                                                                                                                                        |
| ------------------- | --------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| couleur d'animation | `Chaîne`  | \\`'blanc''                                            | Couleur de l'animation de la superposition d'entraînement. Ce paramètre accepte les arguments de couleur CSS valides.                                              |
| couleur de l'invite | `Chaîne`  | \\`'blanc''                                            | Couleur de l'ensemble du texte de la superposition d'accompagnement. Ce paramètre accepte les arguments de couleur CSS valides.                                    |
| texte de l'invite   | `Chaîne`  | `Pointez votre téléphone vers le ciel`. | Définit la chaîne de texte pour le texte explicatif de l'animation qui informe les utilisateurs du mouvement qu'ils doivent effectuer.                                             |
| disablePrompt       | `Booléen` | `false`                                                 | La valeur "true" permet de masquer la superposition d'entraînement par défaut afin d'utiliser les événements de superposition d'entraînement pour une superposition personnalisée. |
| autoByThreshold     | `Booléen` | `true`                                                  | Afficher/masquer automatiquement l'incrustation en fonction du pourcentage de pixels du ciel au-dessus/au-dessous de `hideThreshold` / `showThreshold`.                            |
| showThreshold       | `Nombre`  | 0.1                                     | Afficher un recouvrement actuellement caché si le pourcentage de pixels du ciel est inférieur à ce seuil.                                                                          |
| Seuil de masquage   | `Nombre`  | 0.05                                    | Masquer une incrustation actuellement affichée si le pourcentage du pixel du ciel est supérieur à ce seuil.                                                                        |

### Créer une superposition de coaching personnalisée pour votre projet {#custom-sky-coaching-overlay}

Sky Coaching Overlay peut être ajouté en tant que module de pipeline et ensuite caché (en utilisant le paramètre `disablePrompt`) afin que vous puissiez facilement utiliser les événements de Coaching Overlay pour déclencher une superposition personnalisée.

- `sky-coaching-overlay.show` : l'événement est déclenché lorsque le Coaching Overlay doit être affiché.
- `sky-coaching-overlay.hide` : l'événement est déclenché lorsque la superposition d'entraînement doit être cachée.

**SkyCoachingOverlay.control** (en anglais)

Par défaut, la superposition d'entraînement Sky Effects affiche et masque automatiquement la superposition d'entraînement selon que l'utilisateur regarde le ciel ou non. Vous pouvez contrôler ce comportement en utilisant `SkyCoachingOverlay.control`.

```javascript
// Afficher la superposition d'entraînement
SkyCoachingOverlay.control.show()
// Cacher la superposition d'entraînement
SkyCoachingOverlay.control.hide()
// Faire en sorte que la superposition d'entraînement dans le ciel s'affiche / se cache automatiquement.
SkyCoachingOverlay.control.setAutoShowHide(true)
// Faire en sorte que la superposition d'entraînement dans le ciel ne s'affiche pas / ne se cache pas automatiquement.
SkyCoachingOverlay.control.setAutoShowHide(false)
// Cache la superposition d'entraînement et la nettoie
SkyCoachingOverlay.control.cleanup()
```

Par exemple, une partie de votre expérience pourrait ne plus nécessiter que l'utilisateur regarde le ciel. Si vous n'appelez pas `setAutoShowHide(false)`, l'écran de coaching apparaîtra au-dessus de votre interface utilisateur. Dans ce cas, appelez `setAutoShowHide(false)`, puis contrôlez manuellement l'affichage et le masquage en utilisant `show()` et `hide()`. Ou lorsque vous êtes prêt à demander à l'utilisateur de regarder à nouveau le ciel, `setAutoShowHide(true)`.

#### Exemple - Superposition de l'encadrement du ciel avec des paramètres spécifiés par l'utilisateur {#example---sky-coaching-overlay-with-user-specified-parameters}

![sky-coachingoverlay-example](/images/sky-coachingoverlay-example.jpg)

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

#### Exemple hors cadre (capture d'écran ci-dessus) {#non-aframe-example--screenshot-above}

```javascript
// Configuré ici
SkyCoachingOverlay.configure({
    animationColor : '#E86FFF',
    promptText : 'Look at the sky!!',
})
XR8.addCameraPipelineModules([ // Ajouter des modules de pipeline de caméra.
    // Modules de pipeline existants.
    XR8.GlTextureRenderer.pipelineModule(), // Dessine le flux de la caméra.
    XR8.Threejs.pipelineModule(), // Crée une scène AR ThreeJS ainsi qu'une scène Sky.
    window.LandingPage.pipelineModule(), // Détecte les navigateurs non supportés et donne des conseils.
    XRExtras.FullWindowCanvas.pipelineModule(), // Modifie le canvas pour remplir la fenêtre.
    XRExtras.Loading.pipelineModule(), // Gère l'écran de chargement au démarrage.
    XRExtras.RuntimeError.pipelineModule(), // Affiche une image d'erreur en cas d'erreur d'exécution.

    // Active la segmentation du ciel.
    XR8.LayersController.pipelineModule(),
    SkyCoachingOverlay.pipelineModule(),

    ...
    mySkySampleScenePipelineModule(),
  ])

  XR8.LayersController.configure({layers : {sky : {invertLayerMask: false}}})
  XR8.Threejs.configure({layerScenes : ['sky']})

```

#### Exemple d'AFrame - Écoute des événements de la superposition de coaching du ciel {#aframe-example---listening-for-sky-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('sky-coaching-overlay.show', () => {
  // Faire quelque chose
 })

this.el.sceneEl.addEventListener('sky-coaching-overlay.hide', () => {
  // Faire quelque chose
})
```

#### Exemple sans cadre - Écoute des événements de superposition de l'encadrement du ciel {#non-aframe-example---listening-for-sky-coaching-overlay-events}

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

## Suivi de la main Coaching Overlay {#hand-tracking-coaching-overlay}

La superposition de coaching pour le suivi de la main permet aux utilisateurs de s'initier au suivi de la main en s'assurant qu'ils pointent leur téléphone
vers une main. Nous avons conçu le Coaching Overlay de manière à ce qu'il soit facilement personnalisable par les développeurs,
, ce qui vous permet de vous concentrer sur la création de votre expérience WebAR.

### Utilisez la superposition de coaching de suivi des mains dans votre projet {#use-hand-tracking-coaching-overlay-in-your-project}

1. Ouvrez votre projet
2. Ajoutez la balise suivante à `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Note : Pour les projets auto-hébergés, vous devez ajouter la balise `<script>` à votre page :

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Si vous le souhaitez, vous pouvez personnaliser les paramètres de votre composant `hand-coaching-overlay` comme défini ci-dessous.
   Pour les projets non-AFrame, veuillez vous référer à la documentation HandCoachingOverlay.configure().

### Paramètres du composant A-Frame (tous facultatifs) {#hand-coaching-overlay-parameters}

| Paramètres          | Type      | Défaut                                                     | Description                                                                                                                                                                                        |
| ------------------- | --------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| couleur d'animation | `Chaîne`  | \\`'blanc''                                               | Couleur de l'animation de la superposition d'entraînement. Ce paramètre accepte les arguments de couleur CSS valides.                                              |
| couleur de l'invite | `Chaîne`  | \\`'blanc''                                               | Couleur de l'ensemble du texte de la superposition d'accompagnement. Ce paramètre accepte les arguments de couleur CSS valides.                                    |
| texte de l'invite   | `Chaîne`  | `Pointez votre téléphone vers votre main`. | Définit la chaîne de texte pour le texte explicatif de l'animation qui informe les utilisateurs du mouvement qu'ils doivent effectuer.                                             |
| disablePrompt       | `Booléen` | `false`                                                    | La valeur "true" permet de masquer la superposition d'entraînement par défaut afin d'utiliser les événements de superposition d'entraînement pour une superposition personnalisée. |

### Créer une superposition de coaching personnalisée pour votre projet {#custom-hand-coaching-overlay}

Hand Coaching Overlay peut être ajouté en tant que module de pipeline et ensuite caché (en utilisant le paramètre `disablePrompt`) afin que vous puissiez facilement utiliser les événements de Coaching Overlay pour déclencher une superposition personnalisée.

- `hand-coaching-overlay.show` : l'événement est déclenché lorsque le Coaching Overlay doit être affiché.
- `hand-coaching-overlay.hide` : l'événement est déclenché lorsque la superposition d'entraînement doit être cachée.

#### Exemple - Superposition de l'entraînement manuel avec des paramètres spécifiés par l'utilisateur {#example---hand-coaching-overlay-with-user-specified-parameters}

![hand-coachingoverlay-example](/images/hand-coaching-overlay-example.jpeg)

#### Exemple de cadre A (capture d'écran ci-dessus) {#a-frame-example-screenshot-above}

```html
<a-scene
  ...
  xrhand="allowedDevices:any ; cameraDirection:back ;"
  hand-coaching-overlay="
    animationColor : #E86FFF ;
    promptText : Dirigez le téléphone vers votre main gauche! ;"
  ...
  renderer="colorManagement : true"
>
```

#### Exemple hors cadre (capture d'écran ci-dessus) {#non-aframe-example--screenshot-above}

```javascript
// Configuré ici
HandCoachingOverlay.configure({
    animationColor : '#E86FFF',
    promptText : 'Pointez le téléphone vers votre main gauche!',
})
XR8.addCameraPipelineModules([ // Ajouter des modules de pipeline de caméra.
    // Modules de pipeline existants.
    XR8.GlTextureRenderer.pipelineModule(), // Dessine le flux de la caméra.
    XR8.Threejs.pipelineModule(), // Crée une scène AR ThreeJS ainsi qu'une scène Sky.
    window.LandingPage.pipelineModule(), // Détecte les navigateurs non supportés et donne des conseils.
    XRExtras.FullWindowCanvas.pipelineModule(), // Modifie le canvas pour remplir la fenêtre.
    XRExtras.Loading.pipelineModule(), // Gère l'écran de chargement au démarrage.
    XRExtras.RuntimeError.pipelineModule(), // Affiche une image d'erreur en cas d'erreur d'exécution.

    // Active le suivi des mains.
    XR8.HandController.pipelineModule(),
    HandCoachingOverlay.pipelineModule(),

    ...
    myHandSampleScenePipelineModule(),
  ])

```

#### Exemple d'AFrame - Écoute des événements de superposition de coaching manuel {#aframe-example---listening-for-hand-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('hand-coaching-overlay.show', () => {
  // Faire quelque chose
 })

this.el.sceneEl.addEventListener('hand-coaching-overlay.hide', () => {
  // Faire quelque chose
})
```

#### Exemple sans cadre - Écoute des événements superposés de coaching manuel {#non-aframe-example---listening-for-hand-coaching-overlay-events}

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
