---
id: invalid-timestamps-detected
---

# Détection d'horodatages non valides

#### Numéro {#issue}

Sur les appareils iOS, les journaux de la console affichent un avertissement qui indique `webvr-polyfill : Invalid timestamps detected : Timestamp from devicemotion outside expected range.`

#### Résolution {#resolution}

Aucune action n'est requise.

Ceci est un **avertissement** provenant de `webvr-polyfill`, une dépendance de la bibliothèque AFrame/8Frame. Devicemotion est un événement provenant du navigateur qui se déclenche à intervalles réguliers. Il indique la force physique d'accélération que l'appareil reçoit à ce moment-là. Ces messages "Horodatage invalide" sont un sous-produit de l'implémentation de la fonction "devicemotion" d'iOS, où les horodatages sont parfois signalés dans le désordre.

Il s'agit simplement d'un **avertissement**, pas d'une erreur, et peut être ignoré sans risque. Elle n'a aucune incidence sur votre expérience de la RA Web.
