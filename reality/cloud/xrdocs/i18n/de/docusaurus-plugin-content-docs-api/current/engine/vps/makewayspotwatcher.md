---
sidebar_label: makeWayspotWatcher()
---

# XR8.Vps.makeWayspotWatcher()

XR8.Vps.makeWayspotWatcher({onVisible, onHidden, pollGps, lat, lng})\\`

## Beschreibung {#description}

Erstellen Sie einen Watcher, der nach allen aktivierten VPS-Standorten sucht, nicht nur nach Projektstandorten.

## Parameter {#parameters}

| Parameter                                                                | Beschreibung                                                                                                                                                                     |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| onVisible [Optional] | Callback, der aufgerufen wird, wenn ein neuer Ort innerhalb eines 1000-Meter-Radius sichtbar wird.                                                               |
| onHidden [Optional]  | Callback, der aufgerufen wird, wenn sich ein Ort, den Sie zuvor gesehen haben, nicht mehr im Umkreis von 1000 Metern von Ihnen befindet.                         |
| pollGps [Optional]   | Wenn "true", wird das GPS eingeschaltet und die Rückrufe "onVisible" und "onHidden" mit allen durch GPS-Bewegung gefundenen/verlorenen Orten aufgerufen.         |
| lat [fakultativ]     | Wenn `lat` oder `lng` gesetzt ist, werden `onVisible` und `onHidden` Callbacks mit allen gefundenen/verlorenen Orten in der Nähe des gesetzten Ortes aufgerufen. |
| lng [Optional]       | Wenn `lat` oder `lng` gesetzt ist, werden `onVisible` und `onHidden` Callbacks mit allen gefundenen/verlorenen Orten in der Nähe des gesetzten Ortes aufgerufen. |

## Rückgabe {#returns}

Ein Objekt mit den folgenden Methoden:

`{dispose(), pollGps(), setLatLng()}`

| Methode                                                                            | Beschreibung                                                                                                         |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| entsorgen()                                                     | Löscht den Status und stoppt gps. Aktualisierungen und ruft keine Rückrufe mehr auf. |
| pollGps(Boolean)                                                | GPS-Updates ein- oder ausschalten.                                                                   |
| setLatLng(lat: Zahl, lng: Zahl) | Setzt den aktuellen Standort des Beobachters auf `lat` / `lng`.                                      |

## Beispiel {#example}

```javascript
const nearbyLocations_ = []

// Zeichnet die Zeit auf, die zwischen dem Abrufen jedes Ortes vom wayspotWatcher vergeht.
let gotAllLocationsTimeout_ = 0

const onLocationVisible = (location) => {
 nearbyLocations_.push(location)

 window.clearTimeout(gotAllLocationsTimeout_)
 gotAllLocationsTimeout_ = window.setTimeout(() => {
   // Wir holen die Orte einzeln.  Wenn wir eine Operation
   // erst durchführen wollen, nachdem wir alle in der Nähe befindlichen Orte erhalten haben, können wir das hier tun.
 }, 0)
}

const onLocationHidden = (Ort) => {
 const index = nearbyLocations_.indexOf(Ort)
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
  // Aufräumen des Watchers
 wayspotWatcher_.dispose()
}

```
