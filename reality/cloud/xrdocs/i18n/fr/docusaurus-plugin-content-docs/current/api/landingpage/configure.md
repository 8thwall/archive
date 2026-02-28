---
sidebar_label: configure()
---

# LandingPage.configure()

`LandingPage.configure({ logoSrc, logoAlt, promptPrefix, url, promptSuffix, textColor, font, textShadow, backgroundSrc, backgroundBlur, backgroundColor, mediaSrc, mediaAlt, mediaAutoplay, mediaAnimation, mediaControls, sceneEnvMap, sceneOrbitIdle, sceneOrbitInteraction, sceneLightingIntensity, vrPromptPrefix })`

## Description {#description}

Configure le comportement et l'apparence du module LandingPage.

## Paramètres (tous facultatifs) {#parameters-all-optional}

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

## Retours {#returns}

Aucun

## Exemple - Code {#example---code}

```javascript
LandingPage.configure({
    mediaSrc : 'https://www.mydomain.com/bat.glb',
    sceneEnvMap : 'hill',
})
```
