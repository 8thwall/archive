---
id: landing-pages
---

# Pages d'atterrissage

Les pages d'atterrissage sont une évolution de nos pages populaires "Almost There".

## Pourquoi utiliser des pages d'atterrissage ? {#why-use-landing-pages}

Nous avons transformé ces pages pour qu'elles deviennent de puissantes opportunités de marque et de marketing pour vous et
vos clients. Tous les modèles de page d'atterrissage sont optimisés pour l'image de marque et l'éducation avec diverses mises en page
, une conception améliorée du code QR et la prise en charge des principaux médias.

Les pages d'atterrissage permettent à vos utilisateurs de vivre une expérience enrichissante, quel que soit l'appareil sur lequel ils se trouvent.
\- Ils apparaissent sur des appareils qui ne sont pas autorisés ou capables d'accéder directement à l'expérience Web AR
. Ils poursuivent également notre mission de rendre la RA accessible en aidant les utilisateurs à atteindre la bonne destination
pour s'engager dans la RA.

Nous avons conçu les pages d'atterrissage de manière à ce qu'il soit extrêmement facile pour les développeurs de personnaliser la page
. Nous voulons que vous puissiez bénéficier d'une page d'atterrissage optimisée tout en vous permettant de consacrer votre temps (
) à l'élaboration de votre expérience WebAR.

## Les pages d'atterrissage s'adaptent intelligemment à votre configuration {#landing-pages-intelligently-adapt-to-your-configuration}

![loading-examples1](/images/landing-examples1.jpg)

![loading-examples2](/images/landing-examples2.jpg)

## Utilisez les pages d'atterrissage dans votre projet {#use-landing-pages-in-your-project}

1. Ouvrez votre projet
2. Ajoutez la balise suivante à `head.html`

`<meta name="8thwall:package" content="@8thwall.landing-page">`

Note : Pour les projets auto-hébergés, vous devez ajouter la balise `<script>` à votre page :

`<script src='https://cdn.8thwall.com/web/landing-page/landing-page.js'></script>`

3. **Supprimez** `xrextras-almost-there` de votre projet A-Frame, ou
   `XRExtras.AlmostThere.pipelineModule()` de votre projet Non-AFrame. (Les pages d'atterrissage comprennent
   , une logique presque réelle, en plus des mises à jour de la page du code QR).
4. Si vous le souhaitez, vous pouvez personnaliser les paramètres de votre composant `landing-page` comme défini ci-dessous. Pour les projets
   Non-AFrame, veuillez vous référer à la documentation [LandingPage.configure()](/legacy/api/landingpage/configure)
   .

## Paramètres du composant A-Frame (tous facultatifs) {#a-frame-component-parameters}

| Paramètres             | Type               | Défaut                                                                | Description                                                                                                                                                                                                                                                                 |
| ---------------------- | ------------------ | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| logoSrc                | `Chaîne`           |                                                                       | Source d'image pour le logo de la marque.                                                                                                                                                                                                                   |
| logoAlt                | `Chaîne`           | `'Logo'`                                                              | Texte Alt pour l'image du logo de la marque.                                                                                                                                                                                                                |
| Préfixe de l'invite    | `Chaîne`           | `Scanner ou visiter'`                                                 | Définit la chaîne de texte de l'appel à l'action avant l'affichage de l'URL de l'expérience.                                                                                                                                                                |
| url                    | `Chaîne`           | Lien 8th.io si 8th Wall est hébergé, ou page actuelle | Définit l'URL et le code QR affichés.                                                                                                                                                                                                                       |
| suffixe de l'invite    | `Chaîne`           | `pour continuer`                                                      | Définit la chaîne de texte de l'appel à l'action après l'affichage de l'URL de l'expérience.                                                                                                                                                                |
| couleur du texte       | Couleur hexagonale | `'#ffffff'`                                                           | Couleur de tout le texte de la page d'atterrissage.                                                                                                                                                                                                         |
| police                 | `Chaîne`           | `"'Nunito', sans-serif"`".                            | Police de tous les textes de la page d'atterrissage. Ce paramètre accepte les arguments CSS valides de type "font-family".                                                                                                                  |
| ombrage du texte       | `Booléen`          | `false`                                                               | Définit la propriété d'ombre du texte pour tout le texte de la page d'atterrissage.                                                                                                                                                                         |
| backgroundSrc          | `Chaîne`           |                                                                       | Source de l'image d'arrière-plan.                                                                                                                                                                                                                           |
| flou d'arrière-plan    | `Nombre`           | `0`                                                                   | Applique un effet de flou au `backgroundSrc` s'il est spécifié. (Les valeurs sont généralement comprises entre 0,0 et 1,0)                                                                                                               |
| couleur de fond        | `Chaîne`           | `'linear-gradient(#464766,#2D2E43)'`                                  | Couleur d'arrière-plan de la page d'atterrissage. Ce paramètre accepte les arguments de couleur d'arrière-plan CSS valides. La couleur d'arrière-plan n'est pas affichée si un background-src ou un sceneEnvMap est défini. |
| mediaSrc               | `Chaîne`           | Image de couverture de l'application, le cas échéant                  | Source média (modèle 3D, image ou vidéo) pour le contenu du héros de la page d'atterrissage. Les sources de média acceptées comprennent l'identifiant de l'élément d'actif ou l'URL statique.                            |
| mediaAlt               | `Chaîne`           | `'Aperçu'`                                                            | Texte Alt pour le contenu de l'image de la page d'atterrissage.                                                                                                                                                                                             |
| mediaAutoplay          | `Booléen`          | `true`                                                                | Si le `mediaSrc` est une vidéo, spécifie si la vidéo doit être jouée au chargement avec le son coupé.                                                                                                                                                       |
| médiaAnimation         | `Chaîne`           | Premier clip d'animation du modèle, le cas échéant                    | Si le `mediaSrc` est un modèle 3D, spécifiez s'il faut jouer un clip d'animation spécifique associé au modèle, ou "aucun".                                                                                                                                  |
| mediaControls          | `Chaîne`           | `'minimal'`                                                           | Si `mediaSrc` est une vidéo, spécifier les contrôles médias affichés à l'utilisateur. Choisissez entre "none", "mininal" ou "browser" (navigateur par défaut)                                                                            |
| sceneEnvMap            | `Chaîne`           | `'champ'`                                                             | Source d'image pointant vers une image équirectangulaire. Ou l'un des environnements prédéfinis suivants : "champ", "colline", "ville", "pastel" ou "espace".                                                               |
| sceneOrbitIdle         | `Chaîne`           | `'spin'`                                                              | Si le `mediaSrc` est un modèle 3D, spécifiez si le modèle doit "tourner" ou "aucun".                                                                                                                                                                        |
| sceneOrbitInteraction  | `Chaîne`           | `'drag'`                                                              | Si le `mediaSrc` est un modèle 3D, spécifiez si l'utilisateur peut interagir avec les contrôles de l'orbite, choisissez "drag", ou "none".                                                                                                                  |
| sceneLightingIntensity | `Nombre`           | `1`                                                                   | Si le `mediaSrc` est un modèle 3D, spécifiez l'intensité de la lumière qui éclaire le mode.                                                                                                                                                                 |
| vrPromptPrefix         | `Chaîne`           | `'ou visite'`                                                         | Définit la chaîne de texte de l'appel à l'action avant l'affichage de l'URL de l'expérience sur les casques VR.                                                                                                                                             |

## Exemples {#examples}

#### Mise en page 3D avec des paramètres spécifiés par l'utilisateur {#3d-layout-with-user-specified-parameters}

![loading-example](/images/landingpage-example.jpg)

#### Exemple d'A-Frame avec URL externe (capture d'écran ci-dessus) {#a-frame-example}

```html
<a-scene
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
  landing-page="mediaSrc : #myModel"
  xrextras-loading
  xrextras-runtime-error
  renderer="colorManagement : true"
  xrweb>

  <!-- We can define assets here to be loaded when A-Frame initializes -->
  <a-assets>
    <a-asset-item id="myModel" src="assets/my-model.glb"></a-asset-item>
  </a-assets>
```

#### Exemple hors cadre (capture d'écran ci-dessus) {#non-aframe-example--screenshot-above}

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
