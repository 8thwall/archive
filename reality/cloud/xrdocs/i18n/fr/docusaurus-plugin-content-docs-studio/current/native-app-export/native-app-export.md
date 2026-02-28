---
id: native-app-export
description: Cette section explique comment utiliser Native App Export.
---

# Exportation d'applications natives

:::info[Beta Fonctionnalité]
L'exportation d'applications natives est actuellement en version bêta et limitée aux versions **Android et iOS**. La prise en charge des ordinateurs de bureau et des casques sera bientôt assurée.
:::

Native App Export vous permet d'emballer votre projet Studio en tant qu'application autonome.

## Exigences {#requirements}

Que ce soit pour iOS ou Android, assurez-vous que votre projet a été réalisé avec succès pour le web au moins une fois avant d'essayer de l'exporter.

### iOS

L'exportation native pour iOS est disponible pour les projets AR et 3D. Votre candidature **ne supportera pas** :

- Notifications push
- Achats in-app

### Android

L'exportation native pour Android n'est disponible que pour les projets 3D non AR. Votre projet **ne doit pas** utiliser :

- Fonctionnalités de la caméra ou de la réalité augmentée
- GPS
- Claviers virtuels ou physiques
- Notifications push
- Achats in-app
- Textures vidéo
- API MediaRecorder
- CSS
