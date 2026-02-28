---
id: assets
---

# actifs

## Description

Cette bibliothèque comprend des fonctions qui gèrent la gestion des actifs.

## Les types

### Demande d'actifs

| Paramètres | Type                 | Description      |
| ---------- | -------------------- | ---------------- |
| id         | eid                  | Non utilisé      |
| url        | chaîne de caractères | L'url de l'actif |

### Statistiques sur les actifs

| Paramètres | Type   | Description                                      |
| ---------- | ------ | ------------------------------------------------ |
| en attente | nombre | Le nombre d'actifs en attente                    |
| complet    | nombre | Le nombre d'actifs qui ont terminé le chargement |
| total      | nombre | Le nombre total d'actifs à charger               |

### Actif

| Paramètres | Type                 | Description                        |
| ---------- | -------------------- | ---------------------------------- |
| données    | blob                 | Données sur les actifs             |
| remoteUrl  | chaîne de caractères | Où les données ont été récupérées  |
| localUrl   | chaîne de caractères | url construite à partir de données |

## Fonctions

### charge

Charger un actif

```ts
ecs.assets.load(assetRequest : AssetRequest) // -> Promise<Asset>
```

### clair

Supprime l'élément demandé des éléments chargés.

```ts
ecs.assets.clear(assetRequest : AssetRequest) // -> Promesse<Asset>
```

### getStatistics

Obtient des statistiques relatives au chargement des actifs.

```ts
ecs.assets.getStatistics() // -> AssetStatistics
```
