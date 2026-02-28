# Référence des événements du studio

Les événements sont au cœur de la création d'expériences dynamiques et interactives dans Studio. Cette référence décrit les différents types d'événements que vous pouvez écouter dans vos projets.

## Catégories d'événements

- [XR Events](xr) : Événements émis par les modules du pipeline de caméras de 8th Wall comme `reality` et `facecontroller`, couvrant des choses comme le suivi de cibles d'images, la création d'emplacements VPS et la détection de visages.

- [Asset Events](assets) : Événements liés aux ressources, tels que les événements de chargement et de lecture des ressources.

- [Événements de la caméra](camera) : Événements liés aux changements d'état de la caméra, y compris les commutations de la caméra active, les modifications des attributs de la caméra XR et les changements d'entité de la caméra active.

- [Événements généraux](general) : Événements principaux au niveau mondial déclenchés dans les expériences de Studio, tels qu'un changement d'espace actif.

- [Événements d'entrée](input) : Événements déclenchés par les interactions de l'utilisateur, y compris les événements liés au toucher, aux gestes et aux clics sur l'interface utilisateur. Couvre à la fois les simples pressions et les gestes multi-touch complexes.

- [Événements physiques](physics) : Événements émis lorsque des interactions physiques se produisent entre des entités, comme le début ou la fin d'une collision.

---

Chaque section d'événement fournit

- Description du moment où l'événement est émis
- Propriétés (le cas échéant) transmises avec l'événement
- Exemples de code montrant comment écouter l'événement globalement ou sur des entités spécifiques
