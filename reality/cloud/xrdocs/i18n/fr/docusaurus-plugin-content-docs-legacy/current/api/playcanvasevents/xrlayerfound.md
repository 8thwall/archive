---
sidebar_position: 1
---

# xr:layerfound

## Description {#description}

Cet événement est émis lorsqu'une couche est trouvée pour la première fois.

`xr:layerfound.detail : { name, percentage }`

| Propriété                              | Description                                                     |
| -------------------------------------- | --------------------------------------------------------------- |
| nom : `chaîne`         | Le nom de la couche qui a été trouvée.          |
| pourcentage : `nombre` | Le pourcentage de pixels qui sont dans le ciel. |

## Exemple {#example}

```javascript
this.app.on('xr:layerfound', (event) => {
  console.log(`Couche ${event.name} trouvée dans ${event.percentage} de l'écran.`)
}, this)
```
