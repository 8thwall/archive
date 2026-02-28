---
id: video-recording
---

# Personnaliser l'enregistrement vidéo

La bibliothèque [XRExtras](https://github.com/8thwall/web/tree/master/xrextras) de 8th Wall fournit des modules
qui répondent aux besoins les plus courants des applications WebAR, notamment l'écran de chargement, les flux de liens sociaux
et la gestion des erreurs.

Le module XRExtras [MediaRecorder](https://github.com/8thwall/web/tree/master/xrextras/src/mediarecorder)
permet de personnaliser facilement l'expérience utilisateur de l'enregistrement vidéo dans votre projet.

Cette section décrit comment personnaliser les vidéos enregistrées avec des éléments tels que le comportement du bouton de capture
(appuyer ou maintenir), l'ajout de filigranes vidéo, la longueur maximale de la vidéo, le comportement et l'aspect de la carte de fin, etc.

## Primitives de la trame A {#a-frame-primitives}

`xrextras-capture-button` : ajoute un bouton de capture à la scène.

| Paramètres      | Type     | Défaut       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------- | -------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mode de capture | `Chaîne` | `'standard'` | Définit le comportement du mode de capture. **standard** : touchez pour prendre une photo, touchez + maintenez pour enregistrer une vidéo. **corrigé** : tapotement pour basculer l'enregistrement vidéo. **photo** : touchez pour prendre une photo. **corrigé** : tapotement pour basculer l'enregistrement vidéo. **photo** : touchez pour prendre une photo. Un des éléments suivants : `[standard, fixe, photo]` |

`xrextras-capture-config` : Configure le média capturé.

| Paramètres                    | Type      | Défaut                              | Description                                                                                                                                                                                                                                                                         |
| ----------------------------- | --------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| max-duration-ms               | int       | `15000`                             | Durée totale de la vidéo (en millisecondes) autorisée par le bouton de capture. Si la carte d'extrémité est désactivée, cela correspond à la durée maximale d'enregistrement de l'utilisateur. 15000 par défaut. |
| dimension maximale            | int       | `1280`                              | Dimension maximale (largeur ou hauteur) de la vidéo capturée.  Pour la configuration des photos, voir [`XR8.CanvasScreenshot.configure()`](/legacy/api/canvasscreenshot/configure)                                                               |
| enable-end-card               | `Booléen` | `true`                              | Si la carte de fin est incluse dans le support enregistré.                                                                                                                                                                                                          |
| cover-image-url               | `Chaîne`  |                                     | Source de l'image de la couverture de la carte de fin. Utilise par défaut l'image de couverture du projet.                                                                                                                                          |
| end-card-call-to-action       | `Chaîne`  | "Essayez-le : '\\` | Définit la chaîne de texte pour l'appel à l'action sur la carte de fin.                                                                                                                                                                                             |
| lien court                    | `Chaîne`  |                                     | Définit la chaîne de texte pour le lien court de la carte de fin. Utilise le lien court du projet par défaut.                                                                                                                                       |
| footer-image-url              | `Chaîne`  | Powered by 8th Wall image           | Source d'image pour l'image de bas de page de la carte de fin.                                                                                                                                                                                                      |
| watermark-image-url           | `Chaîne`  | `null`                              | Source de l'image pour le filigrane.                                                                                                                                                                                                                                |
| largeur maximale du filigrane | int       | 20                                  | Largeur maximale (%) de l'image du filigrane.                                                                                                                                                                                                    |
| hauteur maximale du filigrane | int       | 20                                  | Hauteur maximale (%) de l'image du filigrane.                                                                                                                                                                                                    |
| emplacement du filigrane      | `Chaîne`  | `'bottomRight'`                     | Emplacement de l'image filigranée. Un des éléments suivants : `topLeft, topMiddle, topRight, bottomLeft, bottomMiddle, bottomRight`                                                                                                                 |
| Préfixe du nom de fichier     | `Chaîne`  | `'my-capture-'`''.  | Définit la chaîne de texte qui ajoute l'horodatage unique au nom du fichier.                                                                                                                                                                                        |
| demande-mic                   | `Chaîne`  | `'auto'`                            | Détermine si vous voulez configurer le microphone pendant l'initialisation (`'auto'`) ou pendant l'exécution (`'manual'`).                                                                                                    |
| inclure-scene-audio           | `Booléen` | `true`                              | Si c'est le cas, les sons A-Frame de la scène feront partie de la sortie enregistrée.                                                                                                                                                                               |

`xrextras-capture-preview` : ajoute un préfabriqué de prévisualisation des médias à la scène qui permet la lecture, le téléchargement et le partage.

| Paramètres               | Type     | Défaut    | Description                                                                                                                                                                                                 |
| ------------------------ | -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| action-button-share-text | `Chaîne` | `Action'` | Définit la chaîne de texte dans le bouton d'action lorsque Web Share API 2 **est** disponible (Android, iOS 15 ou supérieur). `'Share'` par défaut.      |
| action-button-view-text  | `Chaîne` | `'Vue'`   | Définit la chaîne de texte dans le bouton d'action lorsque Web Share API 2 n'est **pas** disponible dans iOS (iOS 14 ou inférieur). `'View'` par défaut. |

## XRExtras.MediaRecorder Events {#xrextrasmediarecorder-events}

XRExtras.MediaRecorder émet les événements suivants.

#### Événements émis {#events-emitted}

| Événement émis                       | Description                                                                                                                                                                               | Détail de l'événement |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| enregistreur multimédia-photocomplet | Émise après la prise d'une photo.                                                                                                                                         | {blob}                |
| mediarecorder-recordcomplete         | Emise après la fin d'un enregistrement vidéo.                                                                                                                             | {videoBlob}           |
| mediarecorder-previewready           | Emis après la fin d'un enregistrement vidéo prévisible. [(Android/Desktop only)](/legacy/api/mediarecorder/recordvideo/#parameters)                    | {videoBlob}           |
| mediarecorder-finaliserleprogrès     | Emis lorsque l'enregistreur de médias progresse dans l'exportation finale. [(Android/Desktop only)](/legacy/api/mediarecorder/recordvideo/#parameters) | {progress, total}     |
| mediarecorder-previewopened          | Emis après l'ouverture de l'aperçu de l'enregistrement.                                                                                                                   | nul                   |
| mediarecorder-previewclosed          | Emis après la fermeture de l'aperçu de l'enregistrement.                                                                                                                  | nul                   |

#### Exemple : Primitives du cadre A {#primitives-example}

```jsx
<xrextras-capture-button capture-mode="standard"></xrextras-capture-button>

<xrextras-capture-config
  max-duration-ms="15000"
  max-dimension="1280"
  enable-end-card="true"
  cover-image-url=""
  end-card-call-to-action="Try it at :"
  short-link=""
  footer-image-url="//cdn.8thwall.com/web/img/almostthere/v2/poweredby-horiz-white-2.svg"
  watermark-image-url="//cdn.8thwall.com/web/img/mediarecorder/8logo.png"
  watermark-max-width="100"
  watermark-max-height="10"
  watermark-location="bottomRight"
  file-name-prefix="my-capture-"
></xrextras-capture-config>

<xrextras-capture-preview
  action-button-share-text="Share"
  action-button-view-text="View"
  finalize-text="Exporting..."
></xrextras-capture-preview>
```

#### Exemple : Événements de la trame A {#example-a-frame-events}

```javascript
window.addEventListener('mediarecorder-previewready', (e) => {
  console.log(e.detail.videoBlob)
})
```

#### Exemple : Modifier le bouton Share CSS {#change-share-button-example}

```css
#actionButton {
  /* changer la couleur du bouton d'action */
  background-color : #007aff !important ;
}
```
