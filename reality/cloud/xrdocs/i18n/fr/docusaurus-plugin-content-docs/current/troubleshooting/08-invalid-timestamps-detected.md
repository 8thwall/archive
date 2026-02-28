---
id: invalid-timestamps-detected
---

# Détection d'horodatages non valides

#### Problème {#issue}

Sur les appareils iOS, les journaux de la console affichent un avertissement qui indique `webvr-polyfill : Des horodatages non valides ont été détectés : Horodatage de devicemotion en dehors de la plage attendue.`

#### Résolution {#resolution}

Aucune action n'est requise.

Il s'agit d'un avertissement **** provenant de `webvr-polyfill`, une dépendance de la bibliothèque AFrame/8Frame. Devicemotion est un événement provenant du navigateur qui se déclenche à intervalles réguliers. Il indique la force physique d'accélération que l'appareil reçoit à ce moment-là. Ces messages "Horodatage invalide" sont un sous-produit de l'implémentation de la fonction "devicemotion" d'iOS, où les horodatages sont parfois signalés dans le désordre.

Il s'agit simplement d'un **avertissement** , et non d'une erreur, et vous pouvez l'ignorer. Elle n'a aucune incidence sur votre expérience de la WebAR.
