---
id: world
sidebar_position: 4
---

# Weltweite Effekte Ereignisse

## Veranstaltungen {#events}

### Trackingstatus {#trackingstatus}

Dieses Ereignis wird von World Effects ausgelöst, wenn der Motor startet und sich der Status oder der Grund der Verfolgung ändert.

#### Eigenschaften

| Eigentum | Typ      | Beschreibung                                               |
| -------- | -------- | ---------------------------------------------------------- |
| Status   | `String` | Eine der Optionen `LIMITED` oder `NORMAL`. |
| Grund    | `String` | Eines von `INITIALIZING` oder `UNDEFINED`. |

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'reality.trackingstatus', (e) => {
    console.log(e)
})
```
