---
sidebar_label: configure()
---

# CoachingOverlay.configure()

`CoachingOverlay.configure({ animationColor, promptColor, promptText, disablePrompt })`

## Descripción {#description}

Configura el comportamiento y el aspecto del Coaching Overlay.

## Parámetros (todos opcionales) {#parameters-all-optional}

| Parámetro      | Tipo      | Por defecto                                          | Descripción                                                                                                                                                                      |
| -------------- | --------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animationColor | `Cadena`  | `'blanco'`                                           | Color de la animación de Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                                                |
| promptColor    | `Cadena`  | `'blanco'`                                           | Color de todo el texto de Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                                               |
| promptText     | `Cadena`  | `'Mover el dispositivo hacia delante y hacia atrás'` | Establece la cadena de texto para el texto explicativo de la animación que informa a los usuarios del movimiento que deben realizar para generar escala.                         |
| disablePrompt  | `Boolean` | `false`                                              | Establécelo como verdadero para ocultar la superposición de coaching por defecto y poder utilizar los eventos de superposición de coaching para una superposición personalizada. |

## Devuelve {#returns}

Ninguno

## Ejemplo - Código {#example---code}

```javascript
CoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: 'Para generar escala empuja el teléfono hacia delante y luego tira hacia atrás',
})
```
