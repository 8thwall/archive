---
id: landing-pages
---

# Pages d'atterrissage

Les pages d'atterrissage sont une évolution de nos pages populaires « Vous y êtes presque ».

## Pourquoi utiliser des pages d’atterrissage ? {#why-use-landing-pages}

Nous avons transformé ces pages pour qu'elles deviennent de puissantes opportunités de marque et de marketing pour vous et vos clients. Tous les modèles de page d'atterrissage sont optimisés pour l'image de marque et l'éducation avec diverses mises en page , une conception améliorée du QR code et la prise en charge des principaux médias.

Les pages d'atterrissage permettent à vos utilisateurs de vivre une expérience enrichissante, quel que soit l'appareil qu’ils utilisent. \- Ils apparaissent sur des appareils qui ne sont pas autorisés ou capables d'accéder directement à l'expérience WebAR. Ils poursuivent également notre mission de rendre la AR accessible en aidant les utilisateurs à se rendre à la bonne destination pour s'engager dans la AR.

Nous avons conçu les pages d'atterrissage de manière à ce qu'il soit extrêmement facile pour les développeurs de personnaliser la page. Nous voulons que vous puissiez bénéficier d'une page d'atterrissage optimisée tout en vous permettant de consacrer votre temps à l'élaboration de votre expérience WebAR.

## Les pages d'atterrissage s'adaptent intelligemment à votre configuration {#landing-pages-intelligently-adapt-to-your-configuration}

![chargement-exemples1](/images/landing-examples1.jpg)

![chargement-exemples2](/images/landing-examples2.jpg)

## Utilisez les pages d'atterrissage dans votre projet {#use-landing-pages-in-your-project}

1. Ouvrez votre projet
2. Ajoutez la balise suivante à `head.html`

`<meta name="8thwall:package" content="@8thwall.landing-page">`

Remarque : pour les projets auto-hébergés, vous devez ajouter la balise `<script>` à votre page :

`<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script&gt ;`

3. **Supprimez** `xrextras-almost-there` de votre projet A-Frame, ou `XRExtras.AlmostThere.pipelineModule()` de votre projet Non-AFrame. (Les pages d'atterrissage comprennent , une logique presque réelle, en plus des mises à jour de la page du QR code)
4. Si vous le souhaitez, vous pouvez personnaliser les paramètres de votre `page d'atterrissage` comme indiqué ci-dessous. Pour les projets Non-AFrame, veuillez vous référer à la documentation [LandingPage.configure()](/api/landingpage/configure) .

## Paramètres du composant A-Frame (tous facultatifs) {#a-frame-component-parameters}

| Paramètres             | Type               | Défaut                                                | Description                                                                                                                                                                                                                 |
| ---------------------- | ------------------ | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| logoSrc                | `Chaîne`           |                                                       | Source d'image pour le logo de la marque.                                                                                                                                                                                   |
| logoAlt                | `Chaîne`           | `logo`                                                | Texte Alt pour l'image du logo de la marque.                                                                                                                                                                                |
| préfixe de l'invite    | `Chaîne`           | `scannez ou visitez`                                  | Définit la chaîne de texte de l'appel à l'action avant l'affichage de l'URL de l'expérience.                                                                                                                                |
| url                    | `Chaîne`           | lien 8th.io si 8th Wall est hébergé, ou page actuelle | Définit l'URL et le QR code affichés.                                                                                                                                                                                       |
| suffixe de l'invite    | `Chaîne`           | `continuer`                                           | Définit la chaîne de texte de l'appel à l'action après l'affichage de l'URL de l'expérience.                                                                                                                                |
| couleur du texte       | Couleur hexagonale | `'#ffffff'`                                           | Couleur de tout le texte de la page d'atterrissage.                                                                                                                                                                         |
| police                 | `Chaîne`           | `"'Nunito', sans-serif"`                              | Police de tous les textes de la page d'atterrissage. Ce paramètre accepte les arguments valides de CSS font-family.                                                                                                         |
| ombrage du texte       | `Booléen`          | `faux`                                                | Définit la propriété d'ombre du texte pour tout le texte de la page d'atterrissage.                                                                                                                                         |
| backgroundSrc          | `Chaîne`           |                                                       | Source de l'image d'arrière-plan.                                                                                                                                                                                           |
| flou d'arrière-plan    | `Nombre`           | `0`                                                   | Applique un effet de flou à l'arrière-plan `backgroundSrc` s'il est spécifié. (Les valeurs sont généralement comprises entre 0,0 et 1,0)                                                                                    |
| couleur de fond        | `Chaîne`           | `'linear-gradient(#464766,#2D2E43)'`                  | Couleur d'arrière-plan de la page d'atterrissage. Ce paramètre accepte les arguments de couleur d'arrière-plan CSS valides. La couleur d'arrière-plan n'est pas affichée si un background-src ou un sceneEnvMap est défini. |
| mediaSrc               | `Chaîne`           | Image de couverture de l'application, le cas échéant  | Source média (modèle 3D, image ou vidéo) pour le contenu du héros de la page d'atterrissage. Les sources de média acceptées comprennent l'identifiant de l'élément d'actif ou l'URL statique.                               |
| mediaAlt               | `Chaîne`           | `« Aperçu »`                                          | Texte Alt pour le contenu de l'image de la page d'atterrissage.                                                                                                                                                             |
| mediaAutoplay          | `Booléen`          | `vrai`                                                | Si le média `mediaSrc` est une vidéo, spécifiez si la vidéo doit être lue au chargement avec le son coupé.                                                                                                                  |
| médiaAnimation         | `Chaîne`           | Premier clip d'animation du modèle, le cas échéant    | Si le `mediaSrc` est un modèle 3D, indiquez s'il faut jouer un clip d'animation spécifique associé au modèle ou "aucun".                                                                                                    |
| mediaControls          | `Chaîne`           | `minimal`                                             | Si `mediaSrc` est une vidéo, spécifiez les contrôles médias affichés à l'utilisateur. Choisissez entre « aucun », « mininal » ou « navigateur » (navigateur par défaut)                                                     |
| sceneEnvMap            | `Chaîne`           | `champ`                                               | Source d'image pointant vers une image équirectangulaire. Ou l'un des environnements prédéfinis suivants : "champ", "colline", "ville", "pastel" ou "espace".                                                               |
| sceneOrbitIdle         | `Chaîne`           | `'spin' (rotation)`                                   | Si le `mediaSrc` est un modèle 3D, indiquez si le modèle doit "tourner" ou "aucun".                                                                                                                                         |
| sceneOrbitInteraction  | `Chaîne`           | `'drag'`                                              | Si le mediaSrc `` est un modèle 3D, indiquez si l'utilisateur peut interagir avec les contrôles de l'orbite, choisissez « faire glisser » ou « aucun ».                                                                     |
| sceneLightingIntensity | `Nombre`           | `1`                                                   | Si le média `mediaSrc` est un modèle 3D, indiquez l'intensité de la lumière qui éclaire le mode.                                                                                                                            |
| vrPromptPrefix         | `Chaîne`           | `ou visite`                                           | Définit la chaîne de texte de l'appel à l'action avant l'affichage de l'URL de l'expérience sur les casques VR.                                                                                                             |

## Exemples {#examples}

#### mise en page 3D avec des paramètres spécifiés par l'utilisateur {#3d-layout-with-user-specified-parameters}

![exemple de chargement](/images/landingpage-example.jpg)

#### Exemple d'A-Frame avec URL externe (capture d'écran ci-dessus) {#a-frame-example}

```html
  landing-page="
    mediaSrc : https://www.mydomain.com/helmet.glb ;
    sceneEnvMap : hill"
  xrextras-loading
  xrextras-gesture-detector
  ...
  xrweb>
```

#### Exemple de cadre A avec un actif local {#a-frame-local-asset example}
```html
<a-scene
  xrextras-gesture-detector
  landing-page="mediaSrc: #myModel"
  xrextras-loading
  xrextras-runtime-error
  renderer="colorManagement: true"
  xrweb>

  <!-- We can define assets here to be loaded when A-Frame initializes -->
  <a-assets>
    <a-asset-item id="myModel" src="assets/my-model.glb"></a-asset-item>
  </a-assets>
```

#### Exemple sans cadre (capture d'écran ci-dessus) {#non-aframe-example--screenshot-above}

```js
// Configuré ici
LandingPage.configure({
    mediaSrc : 'https://www.mydomain.com/bat.glb',
    sceneEnvMap : 'hill',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  // Ajouté ici
  LandingPage.pipelineModule(),
  ...
])
```
