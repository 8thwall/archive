---
sidebar_label: configure()
---

# VpsCoachingOverlay.configure()

`VpsCoachingOverlay.configure({ wayspotName, hintImage, animationColor, animationDuration, textColor, promptPrefix, promptSuffix, statusText, disablePrompt })`

## Descripción {#description}

Configura el comportamiento y el aspecto de la superposición de coaching del VPS Lightship.

## Parámetros (todos opcionales) {#parameters-all-optional}

| Parámetro         | Tipo      | Por defecto              | Descripción                                                                                                                                                                                                                                                                                                        |
| ----------------- | --------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| wayspotName       | `Cadena`  |                          | El nombre de la ubicación en la que la Superposición de Coaching está guiando al usuario para que se localice. Si no se especifica ningún nombre de Ubicación, utilizará la Ubicación de Proyecto más cercana. Si el proyecto no tiene ninguna Ubicación de Proyecto, entonces utilizará la Ubicación más cercana. |
| hintImage         | `Cadena`  |                          | Imagen mostrada al usuario para guiarle hasta la ubicación en el mundo real. Si no se especifica hint-image, se utilizará la imagen por defecto para la Ubicación. Si la Ubicación no tiene una imagen por defecto, no se mostrará ninguna imagen.                                                                 |
| animationColor    | `Cadena`  | `'#ffffff'`              | Color de la animación superposición de coaching. Este parámetro acepta argumentos de color CSS válidos.                                                                                                                                                                                                            |
| animationDuration | `Number`  | `5000`                   | Tiempo total que se muestra la imagen de sugerencia antes de encogerse (en milisegundos).                                                                                                                                                                                                                          |
| textColor         | `Cadena`  | `'#ffffff'`              | Color de todo el texto de coaching superpuesto. Este parámetro acepta argumentos de color CSS válidos.                                                                                                                                                                                                             |
| promptPrefix      | `Cadena`  | `'Point your camera at'` | Establece la cadena de texto para la acción de usuario asesorado por encima del nombre de la Ubicación.                                                                                                                                                                                                            |
| promptSuffix      | `Cadena`  | `'and move around'`      | Establece la cadena de texto para la acción de usuario aconsejada debajo del nombre de la Ubicación.                                                                                                                                                                                                               |
| statusText        | `Cadena`  | `'Scanning...'`          | Establece la cadena de texto que se muestra debajo de la imagen intermedia cuando está en estado reducido.                                                                                                                                                                                                         |
| disablePrompt     | `Boolean` | `false`                  | Establécelo como verdadero para ocultar la superposición de coaching por defecto y poder utilizar los eventos de superposición de coaching para una superposición personalizada.                                                                                                                                   |

## Devuelve {#returns}

Ninguno

## Ejemplo - Código {#example---code}

```javascript
VpsCoachingOverlay.configure({
    textColor: '#0000FF',
    promptPrefix: 'Go look for',
})
```
