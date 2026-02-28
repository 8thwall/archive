---
id: world
sidebar_position: 4
---

# Efectos mundiales Eventos

## Eventos {#events}

### trackingstatus {#trackingstatus}

Este evento es emitido por World Effects cuando se inicia el motor y cambia el estado o motivo del seguimiento.

#### Propiedades

| Propiedad | Tipo   | Descripción                                                       |
| --------- | ------ | ----------------------------------------------------------------- |
| estado    | Cadena | Una de las opciones `LIMITED` o `NORMAL`.         |
| motivo    | Cadena | Una de las opciones `INITIALIZING` o `UNDEFINED`. |

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'reality.trackingstatus', (e) => {
    console.log(e)
})
```
