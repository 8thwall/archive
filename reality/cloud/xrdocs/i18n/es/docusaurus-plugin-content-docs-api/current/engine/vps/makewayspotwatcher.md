---
sidebar_label: makeWayspotWatcher()
---

# XR8.Vps.makeWayspotWatcher()

`XR8.Vps.makeWayspotWatcher({onVisible, onHidden, pollGps, lat, lng})`

## Descripción {#description}

Cree un observador para buscar todas las Ubicaciones activadas por VPS, no sólo las Ubicaciones de Proyecto.

## Parámetros {#parameters}

| Parámetro                                                                | Descripción                                                                                                                                                                           |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| onVisible [Opcional] | Llamada de retorno que se realiza cuando una nueva ubicación se hace visible en un radio de 1000 metros.                                                              |
| onHidden [Opcional]  | Llamada de retorno que se realiza cuando una Ubicación que viste anteriormente ya no se encuentra dentro de un radio de 1000 metros de ti.                            |
| pollGps [Opcional]   | Si es true, activa el GPS y llama a las llamadas de retorno 'onVisible' y 'onHidden' con cualquier Localización encontrada/perdida a través del movimiento GPS.       |
| lat [Opcional]       | Si se establece `lat` o `lng`, llama a las llamadas de retorno `onVisible` y `onHidden` con cualquier Ubicación encontrada/perdida cerca de la ubicación establecida. |
| lng [Opcional]       | Si se establece `lat` o `lng`, llama a las llamadas de retorno `onVisible` y `onHidden` con cualquier Ubicación encontrada/perdida cerca de la ubicación establecida. |

## Devuelve {#returns}

Un objeto con los siguientes métodos:

`{dispose(), pollGps(), setLatLng()}`

| Método                                                                                 | Descripción                                                                                                                  |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| eliminar()                                                          | Borra el estado y detiene el gps. Actualiza y ya no llamará a ninguna devolución de llamada. |
| pollGps(Boolean)                                                    | Activa o desactiva las actualizaciones del GPS.                                                              |
| setLatLng(lat: número, lng: número) | Establece la ubicación actual del observador en `lat` / `lng`.                                               |

## Ejemplo {#example}

```javascript
const nearbyLocations_ = []

// Registra el tiempo entre la obtención de cada localización desde el wayspotWatcher.
let gotAllLocationsTimeout_ = 0

const onLocationVisible = (localización) => {
 nearbyLocations_.push(localización)

 window.clearTimeout(gotAllLocationsTimeout_)
 gotAllLocationsTimeout_ = window.setTimeout(() => {
   // Obtenemos las localizaciones individualmente.  Si sólo queremos realizar una operación
   // después de haber obtenido todas las cercanas, podríamos hacerlo aquí.
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
  // Limpiar el observador
 wayspotWatcher_.dispose()
}

```
