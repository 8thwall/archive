---
id: general
---

# Allgemeine Ereignisse

## Veranstaltungen

### AKTIV_SPACE_CHANGE

Wird ausgesendet, wenn die Welt einen Space lädt (kein Versprechen, dass der Space geladen wird).

#### Eigenschaften

Keine.

#### Beispiel

```ts
world.events.addListener(world.events.globalId, ecs.events.ACTIVE_SPACE_CHANGE, () => {
    console.log('Active space change');
});
```

### ORT_GESPAWNT

Wird ausgesendet, wenn ein VPS-Standort auf der Karte gespawnt wird.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung                                                        |
| -------- | ------ | ------------------------------------------------------------------- |
| id       | String | Der eindeutige Bezeichner für den Ort                               |
| imageUrl | String | Das Standortbild                                                    |
| Titel    | String | Der Titel des Standorts                                             |
| lat      | Nummer | Breitengrad des Standortes                                          |
| lng      | Nummer | Längengrad des Standortes                                           |
| mapPoint | Eid    | Die gespawnte Map Point-Entität, unter der der Inhalt geparent wird |

#### Beispiel (Global)

```ts
world.events.addListener(world.events.globalId, ecs.events.LOCATION_SPAWNED, ({data}) => {
    console.log(data)
})
```

#### Beispiel (Entitätsspezifisch)

```ts
world.events.addListener(mapEid, ecs.events.LOCATION_SPAWNED, ({data}) => {
    console.log(data)
})
```

### Realität bereits

Dieses Ereignis wird ausgelöst, wenn 8th Wall Web initialisiert wurde.

#### Eigenschaften

Keine.

#### Beispiel

```ts
world.events.addListener(world.events.globalId, 'realityready', () => {
    console.log('realityready');
});
```
