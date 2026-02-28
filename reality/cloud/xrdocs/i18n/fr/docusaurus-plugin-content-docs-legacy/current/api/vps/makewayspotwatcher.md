---
sidebar_label: makeWayspotWatcher()
---

# XR8.Vps.makeWayspotWatcher()

`XR8.Vps.makeWayspotWatcher({onVisible, onHidden, pollGps, lat, lng})`

## Description {#description}

Créer un observateur pour rechercher tous les emplacements activés par le SPV, et pas seulement les emplacements de projet.

## Paramètres {#parameters}

| Paramètres                                                                 | Description                                                                                                                                                                  |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| onVisible [Facultatif] | Rappel appelé lorsqu'un nouvel emplacement devient visible dans un rayon de 1000 mètres.                                                                     |
| onHidden [Facultatif]  | Rappel qui est appelé lorsqu'un lieu que vous avez vu précédemment n'est plus dans un rayon de 1000 mètres autour de vous.                                   |
| pollGps [Facultatif]   | Si true, active le GPS et appelle les callbacks 'onVisible' et 'onHidden' avec tous les emplacements trouvés/perdus grâce au mouvement GPS.                  |
| lat [Facultatif]       | Si `lat` ou `lng` est défini, appelle les callbacks `onVisible` et `onHidden` avec tous les emplacements trouvés/perdus à proximité de l'emplacement défini. |
| lng [Facultatif]       | Si `lat` ou `lng` est défini, appelle les callbacks `onVisible` et `onHidden` avec tous les emplacements trouvés/perdus à proximité de l'emplacement défini. |

## Retourne {#returns}

Un objet avec les méthodes suivantes :

`{dispose(), pollGps(), setLatLng()}`

| Méthode                                                                                  | Description                                                                                                      |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| disposer()                                                            | Efface l'état et arrête le GPS. est mis à jour et n'appellera plus de callbacks. |
| pollGps(Booléen)                                                      | Activer ou désactiver les mises à jour du GPS.                                                   |
| setLatLng(lat : Nombre, lng : Nombre) | Fixe la position actuelle de l'observateur à `lat` / `lng`.                                      |

## Exemple {#example}

```javascript
const nearbyLocations_ = []

// Enregistre le temps qui s'écoule entre l'obtention de chaque emplacement auprès du waypotWatcher.
let gotAllLocationsTimeout_ = 0

const onLocationVisible = (emplacement) => {
 nearbyLocations_.push(emplacement)

 window.clearTimeout(gotAllLocationsTimeout_)
 gotAllLocationsTimeout_ = window.setTimeout(() => {
   // Nous obtenons les emplacements de manière individuelle.  Si nous voulons effectuer une opération
   // seulement après avoir obtenu tous les emplacements proches, nous pouvons le faire ici.
 }, 0)
}

const onLocationHidden = (location) => {
 const index = nearbyLocations_.indexOf(location)
 if (index > -1) {
   foundProjectLocations_.splice(index, 1)
 }
}

const onAttach = ({}) => {
 wayspotWatcher_ = XR8.Vps.makeWayspotWatcher(
   {onVisible: onLocationVisible, onHidden: onLocationHidden, pollGps: true}
 )
}

const onDetach = ({}) => {
  // Nettoyer le watcher
 wayspotWatcher_.dispose()
}

```
