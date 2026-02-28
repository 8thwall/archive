---
sidebar_label: configure()
---

# LandingPage.configure()

`LandingPage.configure({ logoSrc, logoAlt, promptPrefix, url, promptSuffix, textColor, font, textShadow, backgroundSrc, backgroundBlur, backgroundColor, mediaSrc, mediaAlt, mediaAutoplay, mediaAnimation, mediaControls, sceneEnvMap, sceneOrbitIdle, sceneOrbitInteraction, sceneLightingIntensity, vrPromptPrefix })`

## Descripción {#description}

Configura el comportamiento y el aspecto del módulo LandingPage.

## Parámetros (todos opcionales) {#parameters-all-optional}

| Parámetro              | Tipo              | Por defecto                                                   | Descripción                                                                                                                                                                               |
| ---------------------- | ----------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| logoSrc                | `Cadena`          |                                                               | Fuente de la imagen del logotipo de la marca.                                                                                                                                             |
| logoAlt                | `Cadena`          | `'Logo'`                                                      | Texto alternativo para la imagen del logotipo de la marca.                                                                                                                                |
| promptPrefix           | `Cadena`          | `'Scan or visit'`                                             | Establece la cadena de texto para la llamada a la acción antes de que se muestre la URL de la experiencia.                                                                                |
| url                    | `Cadena`          | enlace de 8th.io si está alojado en 8th Wall, o página actual | Establece la URL y el código QR mostrados.                                                                                                                                                |
| promptSuffix           | `Cadena`          | `'to continue'`                                               | Establece la cadena de texto para la llamada a la acción después de que se muestre la URL de la experiencia.                                                                              |
| textColor              | Color hexadecimal | `#ffffff`                                                     | Color de todo el texto de la página de destino.                                                                                                                                           |
| font                   | `Cadena`          | `"'Nunito', sans-serif"`                                      | Fuente de todo el texto de la página de destino. Este parámetro acepta argumentos CSS válidos de font-family.                                                                             |
| textShadow             | `Boolean`         | `false`                                                       | Establece la propiedad sombra de texto para todo el texto de la página de destino.                                                                                                        |
| backgroundSrc          | `Cadena`          |                                                               | Fuente de la imagen de fondo.                                                                                                                                                             |
| backgroundBlur         | `Number`          | `0`                                                           | Aplica un efecto de desenfoque al `backgroundSrc` si se especifica uno. (Los valores típicos están entre 0,00 y 1,00)                                                                     |
| backgroundColor        | `Cadena`          | `'linear-gradient(#464766,#2D2E43)'`                          | Color de fondo de la página de destino. Este parámetro acepta argumentos válidos de color de fondo CSS. El color de fondo no se muestra si se establece un background-src o sceneEnvMap.  |
| mediaSrc               | `Cadena`          | Imagen de portada de la aplicación, si existe                 | Fuente multimedia (modelo 3D, imagen o vídeo) para el contenido principal de la página de destino. Las fuentes de medios aceptadas incluyen un id de elemento-activo, o una URL estática. |
| mediaAlt               | `Cadena`          | `'Preview'`                                                   | Texto alternativo para el contenido de la imagen de la página de destino.                                                                                                                 |
| mediaAutoplay          | `Boolean`         | `true`                                                        | Si el `mediaSrc` es un vídeo, especifica si el vídeo debe reproducirse al cargarse con el sonido silenciado.                                                                              |
| mediaAnimation         | `Cadena`          | Primer clip de animación del modelo, si existe                | Si el `mediaSrc` es un modelo 3D, especifica si quieres reproducir un clip de animación específico asociado al modelo, o "none".                                                          |
| mediaControls          | `Cadena`          | `'minimal'`                                                   | Si `mediaSrc` es un vídeo, especifica los controles multimedia que se muestran al usuario. Elige entre "none", "mininal" o "browser" (navegador por defecto)                              |
| sceneEnvMap            | `Cadena`          | `'field'`                                                     | Fuente de imagen que apunta a una imagen equirectangular. O uno de los siguientes entornos preestablecidos: "field", "hill", "city", "pastel", o "space".                                 |
| sceneOrbitIdle         | `Cadena`          | `'spin'`                                                      | Si `mediaSrc` es un modelo 3D, especifica si el modelo debe hacer "spin", o "none".                                                                                                       |
| sceneOrbitInteraction  | `Cadena`          | `'drag'`                                                      | Si el `mediaSrc` es un modelo 3D, especifica si el usuario puede interactuar con los controles de la órbita, elige "drag" o "none".                                                       |
| sceneLightingIntensity | `Number`          | `1`                                                           | Si `mediaSrc` es un modelo 3D, especifica la intensidad de la luz que ilumina el modo.                                                                                                    |
| vrPromptPrefix         | `Cadena`          | `'or visit'`                                                  | Establece la cadena de texto para la llamada a la acción antes de que se muestre la URL de la experiencia en los cascos de VR.                                                            |

## Devuelve {#returns}

Ninguno

## Ejemplo - Código {#example---code}

```javascript
LandingPage.configure({
    mediaSrc: 'https://www.mydomain.com/bat.glb',
    sceneEnvMap: 'hill',
})
```
