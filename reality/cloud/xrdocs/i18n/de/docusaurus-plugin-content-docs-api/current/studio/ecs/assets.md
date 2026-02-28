---
id: assets
---

# Vermögenswerte

## Beschreibung

Diese Bibliothek enthält Funktionen für die Verwaltung von Vermögenswerten.

## Typen

### AssetRequest

| Parameter | Typ    | Beschreibung       |
| --------- | ------ | ------------------ |
| id        | eid    | Unbenutzt          |
| url       | String | Die Url des Assets |

### AssetStatistik

| Parameter   | Typ    | Beschreibung                                             |
| ----------- | ------ | -------------------------------------------------------- |
| anhängig    | Nummer | Die Anzahl der ausstehenden Vermögenswerte               |
| vollständig | Nummer | Die Anzahl der Assets, die das Laden abgeschlossen haben |
| insgesamt   | Nummer | Die Gesamtzahl der zu ladenden Assets                    |

### Vermögen

| Parameter | Typ    | Beschreibung                  |
| --------- | ------ | ----------------------------- |
| Daten     | Klecks | Vermögensdaten                |
| remoteUrl | String | Woher die Daten geholt wurden |
| localUrl  | String | aus Daten konstruierte Url    |

## Funktionen

### laden

Ein Asset laden

```ts
ecs.assets.load(assetRequest: AssetRequest) // -> Promise<Asset>
```

### klar

Löscht das Anfrage-Asset aus den geladenen Assets.

```ts
ecs.assets.clear(assetRequest: AssetRequest) // -> Versprechen<Asset>
```

### getStatistics

Ruft Statistiken über das Laden von Assets ab.

```ts
ecs.assets.getStatistics() // -> AssetStatistik
```

