---
sidebar_label: configure()
---

# VpsCoachingOverlay.configure()

`VpsCoachingOverlay.configure({ wayspotName, hintImage, animationColor, animationDuration, textColor, promptPrefix, promptSuffix, statusText, disablePrompt })`

## Description {#description}

Configure le comportement et l'apparence de la superposition de l'encadrement du VPS Lightship.

## Paramètres (tous facultatifs) {#parameters-all-optional}

| Paramètres             | Type      | Défaut                                                 | Description                                                                                                                                                                                                                                                                                                                                   |
| ---------------------- | --------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nom du point de repère | `Chaîne`  |                                                        | Le nom de l'endroit où la superposition d'accompagnement guide l'utilisateur pour qu'il se localise. Si aucun nom d'emplacement n'est spécifié, il utilisera l'emplacement de projet le plus proche. Si le projet n'a pas d'emplacement de projet, il utilisera l'emplacement le plus proche. |
| hintImage              | `Chaîne`  |                                                        | Image affichée à l'utilisateur pour le guider vers le lieu réel. Si aucune image secondaire n'est spécifiée, l'image par défaut de l'emplacement sera utilisée. Si l'emplacement n'a pas d'image par défaut, aucune image ne sera affichée.                                                   |
| couleur d'animation    | `Chaîne`  | `'#ffffff'`                                            | Couleur de l'animation de la superposition d'entraînement. Ce paramètre accepte les arguments de couleur CSS valides.                                                                                                                                                                                         |
| durée de l'animation   | `Nombre`  | `5000`                                                 | Durée totale d'affichage de l'image de l'indice avant son rétrécissement (en millisecondes).                                                                                                                                                                                                               |
| couleur du texte       | `Chaîne`  | `'#ffffff'`                                            | Couleur de l'ensemble du texte de la superposition d'accompagnement. Ce paramètre accepte les arguments de couleur CSS valides.                                                                                                                                                                               |
| Préfixe de l'invite    | `Chaîne`  | `Pointez votre appareil photo sur'' `. | Définit la chaîne de texte pour l'action utilisateur conseillée au-dessus du nom de l'emplacement.                                                                                                                                                                                                                            |
| suffixe de l'invite    | `Chaîne`  | `"et se déplacer"`                                     | Définit la chaîne de texte pour l'action utilisateur conseillée sous le nom de l'emplacement.                                                                                                                                                                                                                                 |
| statusText             | `Chaîne`  | `Scanning...'`                                         | Définit la chaîne de texte qui s'affiche sous l'image secondaire lorsqu'elle est réduite.                                                                                                                                                                                                                                     |
| disablePrompt          | `Booléen` | `false`                                                | La valeur "true" permet de masquer la superposition d'entraînement par défaut afin d'utiliser les événements de superposition d'entraînement pour une superposition personnalisée.                                                                                                                                            |

## Retourne {#returns}

Aucun

## Exemple - Code {#example---code}

```javascript
VpsCoachingOverlay.configure({
    textColor : '#0000FF',
    promptPrefix : 'Go look for',
})
```
