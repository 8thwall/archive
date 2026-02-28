---
sidebar_label: configure()
---

# CoachingOverlay.configure()

`CoachingOverlay.configure({ animationColor, promptColor, promptText, disablePrompt })`

## Description {#description}

Configure le comportement et l'apparence de la superposition d'entraînement.

## Paramètres (tous facultatifs) {#parameters-all-optional}

| Paramètres          | Type      | Défaut                                                                | Description                                                                                                                                                                                        |
| ------------------- | --------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| couleur d'animation | `Chaîne`  | \\`'blanc''                                                          | Couleur de l'animation de la superposition d'entraînement. Ce paramètre accepte les arguments de couleur CSS valides.                                              |
| couleur de l'invite | `Chaîne`  | \\`'blanc''                                                          | Couleur de l'ensemble du texte de la superposition d'accompagnement. Ce paramètre accepte les arguments de couleur CSS valides.                                    |
| texte de l'invite   | `Chaîne`  | `Déplacer l'appareil vers l'avant et vers l'arrière`. | Définit la chaîne de texte pour le texte explicatif de l'animation qui informe les utilisateurs du mouvement qu'ils doivent effectuer pour générer l'échelle.                      |
| disablePrompt       | `Booléen` | `false`                                                               | La valeur "true" permet de masquer la superposition d'entraînement par défaut afin d'utiliser les événements de superposition d'entraînement pour une superposition personnalisée. |

## Retourne {#returns}

Aucun

## Exemple - Code {#example---code}

```javascript
CoachingOverlay.configure({
    animationColor : '#E86FFF',
    promptText : 'To generate scale push your phone forward and then pull back',
})
```
