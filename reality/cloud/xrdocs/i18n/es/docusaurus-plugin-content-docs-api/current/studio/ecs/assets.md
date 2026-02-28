---
id: assets
---

# activos

## Descripción

Esta biblioteca incluye funciones que se encargan de la gestión de activos.

## Tipos

### SolicitudDeActivos

| Parámetro | Tipo   | Descripción       |
| --------- | ------ | ----------------- |
| id        | eid    | No utilizado      |
| url       | cadena | La url del activo |

### Estadísticas de activos

| Parámetro | Tipo   | Descripción                                   |
| --------- | ------ | --------------------------------------------- |
| pendiente | número | El número de activos pendientes               |
| completa  | número | Número de activos que han completado la carga |
| total     | número | El número total de activos que deben cargarse |

### Activo

| Parámetro | Tipo   | Descripción                      |
| --------- | ------ | -------------------------------- |
| datos     | blob   | Datos patrimoniales              |
| remoteUrl | cadena | Origen de los datos              |
| localUrl  | cadena | url construida a partir de datos |

## Funciones

### carga

Cargar un activo

```ts
ecs.assets.load(assetRequest: AssetRequest) // -> Promise<Asset>
```

### borrar

Borra el activo solicitado de los activos cargados.

```ts
ecs.assets.clear(assetRequest: AssetRequest) // -> Promise<Asset>
```

### getStatistics

Obtiene estadísticas relacionadas con la carga de activos.

```ts
ecs.assets.getStatistics() // -> AssetStatistics
```

