---
sidebar_label: configurar()
---

# CoachingOverlay.configure()

`CoachingOverlay.configure({ animationColor, promptColor, promptText, disablePrompt })`

## Descripción {#description}

Configura el comportamiento y el aspecto de la Superposición de Coaching.

## Parámetros (todos opcionales) {#parameters-all-optional}

| Parámetro      | Tipo     | Por defecto                                          | Descripción                                                                                                                                                                                        |
| -------------- | -------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animationColor | Cadena   | `'blanco'`                                           | Color de la animación Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                                     |
| promptColor    | Cadena   | `'blanco'`                                           | Color de todo el texto de Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                                 |
| promptText     | Cadena   | `'Mover el dispositivo hacia delante y hacia atrás'` | Establece la cadena de texto para el texto explicativo de la animación que informa a los usuarios del movimiento que deben realizar para generar escala.                           |
| disablePrompt  | Booleano | `false`                                              | Establézcalo como true para ocultar la sobreimpresión de Coaching predeterminada y poder utilizar los eventos de sobreimpresión de Coaching para una sobreimpresión personalizada. |

## Devuelve {#returns}

Ninguno

## Ejemplo - Código {#example---code}

```javascript
CoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: 'To generate scale push your phone forward and then pull back',
})
```
