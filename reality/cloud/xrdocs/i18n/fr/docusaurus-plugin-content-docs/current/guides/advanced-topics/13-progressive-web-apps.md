---
id: progressive-web-apps
---

# Applications Web progressives

Les applications web progressives (PWA) utilisent les capacités modernes du web pour offrir aux utilisateurs une expérience similaire à celle d'une application native. Le 8th Wall Cloud Editor vous permet de créer une version PWA de votre projet afin que les utilisateurs puissent l'ajouter à leur écran d'accueil. Pour y accéder, **les utilisateurs doivent être** connectés à l'internet.

Pour activer la prise en charge de PWA pour votre projet WebAR :

1. Visitez la page des paramètres de votre projet et développez le volet "Progressive Web App". (Uniquement visible pour les espaces de travail payants)
2. Faites basculer le curseur pour activer la prise en charge de la PWA.
3. Personnalisez le nom, l'icône et les couleurs de votre PWA.
4. Cliquez sur "Enregistrer"

![paramètres du projet-pwa](/images/project-settings-pwa.jpg)

**Note**: Pour les projets du Cloud Editor, vous pouvez être invité à construire et à republier votre projet s'il a déjà été publié. Si vous décidez de ne pas republier, la prise en charge de la PWA sera incluse lors de la prochaine fois que votre projet sera construit.

## Référence de l'API PWA {#pwa-api-reference}

la bibliothèque **XRExtras** de 8th Wall fournit une API pour afficher automatiquement une invite d'installation dans votre application web.

Veuillez consulter la référence de l'API `PwaInstaller` à l'adresse suivante : <https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule>

## Exigences en matière d'icônes PWA {#pwa-icon-requirements}

* Types de fichiers : **.png**
* Ratio d’aspect : **1:1**
* Dimensions :
  * Minimum : **512 x 512 pixels**
    * Remarque : Si vous chargez une image d'une taille supérieure à 512x512, elle sera recadrée au format 1:1 et redimensionnée à 512x512.

## Personnalisation de l'invite d'installation de la PWA {#pwa-install-prompt-customization}

Le module [PwaInstaller](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule) de XRExtras affiche une invite d'installation demandant à votre utilisateur d'ajouter votre application web à son écran d'accueil.

Pour personnaliser l'apparence de votre invite d'installation, vous pouvez fournir des valeurs de chaîne personnalisées via l'API [XRExtras.PwaInstaller.configure()](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule#configure).

Pour obtenir une invite d'installation totalement personnalisée, configurez le programme d'installation avec [displayInstallPrompt](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule#displayinstallprompt) et [hideInstallPrompt](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule#hideinstallprompt)

## Utilisation des PWA auto-hébergées {#self-hosted-pwa-usage}

Pour les applications auto-hébergées, nous ne sommes pas en mesure d'injecter automatiquement les détails de la PWA dans le HTML, nécessitant l'utilisation de l'API de configuration avec le nom et l'icône qu'ils souhaitent voir apparaître dans l’invitation d'installation.

Ajoutez les balises `` suivantes au `<head>` de votre html :

`<meta name="8thwall:pwa_name" content="Mon nom de PWA"&gt ;`

`<meta name="8thwall:pwa_icon" content="//cdn.mydomain.com/my_icon.png"&gt ;`

## Exemples de code PWA {#pwa-code-examples}

#### Exemple de base (AFrame) {#basic-example-aframe}

```html
  xrextras-almost-there
  xrextras-loading
  xrextras-runtime-ror
  xrextras-pwa-installer
  xrweb>
```

#### Exemple de base (sans cadre) {#basic-example-non-aframe}

```javascript
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.AlmostThere.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),

  XRExtras.PwaInstaller.pipelineModule(), // Ajouté ici

  // Modules de pipeline personnalisés.
  myCustomPipelineModule(),
])

```

#### Exemple de look personnalisé (AFrame) {#customized-look-example-aframe}

```html
  xrextras-gesture-detector
  xrextras-almost-there
  xrextras-loading
  xrextras-runtime-error
  xrextras-pwa-installer="name : My Cool PWA ;
    iconSrc : '//cdn.8thwall.com/my_custom_icon' ;
    installTitle : 'My CustomTitle' ;
    installSubtitle : 'My Custom Subtitle' ;
    installButtonText : 'Installation personnalisée' ;
    iosInstallText : 'Custom iOS Install'"
  xrweb>
```

#### Exemple de présentation personnalisée (sans cadre) {#customized-look-example-non-aframe}

```javascript
XRExtras.PwaInstaller.configure({
  displayConfig : {
    name : 'Mon nom PWA personnalisé',
    iconSrc : '//cdn.8thwall.com/my_custom_icon',
    installTitle : ' Mon titre personnalisé',
    installSubtitle : 'Mon sous-titre personnalisé',
    installButtonText : 'Installation personnalisée',
    iosInstallText : 'Custom iOS Install',
  }
})
```

#### Exemple de durée d'affichage personnalisée (AFrame) {#customized-display-time-example-aframe}

```html
  xrweb="disableWorldTracking : true"
  xrextras-gesture-detector
  xrextras-almost-there
  xrextras-loading
  xrextras-runtime-error
  xrextras-pwa-installer="minNumVisits : 5 ;
    displayAfterDismissalMillis : 86400000 ;"
>
```

#### Exemple de durée d'affichage personnalisée (sans cadre) {#customized-display-time-example-non-aframe}

```javascript
XRExtras.PwaInstaller.configure({
  promptConfig : {
    minNumVisits : 5, // Les utilisateurs doivent visiter l'application web 5 fois avant d'être invités
    displayAfterDismissalMillis : 86400000 // One day
  }
})
```
