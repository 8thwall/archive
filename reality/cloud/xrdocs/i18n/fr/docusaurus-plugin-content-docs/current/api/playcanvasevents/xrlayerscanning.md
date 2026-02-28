---
sidebar_position: 1
---

# xr:balayage de couches

## Description {#description}

Cet événement est émis lorsque toutes les ressources de segmentation des couches ont été chargées et que le scan a commencé. Un événement est envoyé par couche en cours d'analyse.

`xr:layercanning.detail : { name }`

| Propriété      | Description                             |
| -------------- | --------------------------------------- |
| nom : `string` | Le nom de la couche que nous analysons. |

## Exemple {#example}

```javascript
this.app.on('xr:layercanning', (event) => {
  console.log(`Layer ${event.name} a commencé le scan.`)
}, this)
```
