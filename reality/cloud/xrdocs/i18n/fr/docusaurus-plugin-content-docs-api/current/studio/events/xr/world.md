---
id: world
sidebar_position: 4
---

# Effets mondiaux Événements

## Événements {#events}

### trackingstatus {#trackingstatus}

Cet événement est émis par World Effects lorsque le moteur démarre et que le statut ou le motif de suivi change.

#### Propriétés

| Propriété | Type     | Description                                            |
| --------- | -------- | ------------------------------------------------------ |
| statut    | `Chaîne` | L'un de `LIMITED` ou `NORMAL`.         |
| raison    | `Chaîne` | L'un de `INITIALIZING` ou `UNDEFINED`. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'reality.trackingstatus', (e) => {
    console.log(e)
})
```
