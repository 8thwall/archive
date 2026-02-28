---
sidebar_label: configurar()
---

# LandingPage.configure()

LandingPage.configure({ logoSrc, logoAlt, promptPrefix, url, promptSuffix, textColor, font, textShadow, backgroundSrc, backgroundBlur, backgroundColor, mediaSrc, mediaAlt, mediaAutoplay, mediaAnimation, mediaControls, sceneEnvMap, sceneOrbitIdle, sceneOrbitInteraction, sceneLightingIntensity, vrPromptPrefix })\`)

## Descripción {#description}

Configura el comportamiento y la apariencia del módulo LandingPage.

## Parámetros (todos opcionales) {#parameters-all-optional}

| Parámetro              | Tipo              | Por defecto                                                                  | Descripción                                                                                                                                                                                                                                 |
| ---------------------- | ----------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| logoSrc                | Cadena            |                                                                              | Fuente de la imagen del logotipo de la marca.                                                                                                                                                                               |
| logoAlt                | Cadena            | Logotipo                                                                     | Texto alternativo para la imagen del logotipo de la marca.                                                                                                                                                                  |
| promptPrefix           | Cadena            | `'Escanear o visitar'`                                                       | Establece la cadena de texto para la llamada a la acción antes de que se muestre la URL de la experiencia.                                                                                                                  |
| url                    | Cadena            | Enlace a 8th.io si está alojado en 8th Wall, o página actual | Establece la URL y el código QR mostrados.                                                                                                                                                                                  |
| promptSuffix           | Cadena            | `'continuar'`                                                                | Establece la cadena de texto para la llamada a la acción después de que se muestre la URL de la experiencia.                                                                                                                |
| textColor              | Color hexadecimal | `'#ffffff'`                                                                  | Color de todo el texto de la Landing Page.                                                                                                                                                                                  |
| fuente                 | Cadena            | `"'Nunito', sans-serif"`                                                     | Fuente de todo el texto de la página de destino. Este parámetro acepta argumentos CSS font-family válidos.                                                                                                  |
| textShadow             | Booleano          | `false`                                                                      | Establece la propiedad text-shadow para todo el texto de la Página de Aterrizaje.                                                                                                                                           |
| backgroundSrc          | Cadena            |                                                                              | Fuente de la imagen de fondo.                                                                                                                                                                                               |
| backgroundBlur         | `Número`          | `0`                                                                          | Aplica un efecto de desenfoque al `backgroundSrc` si se especifica uno. (Los valores típicos están entre 0,0 y 1,0)                                                                                      |
| backgroundColor        | Cadena            | `'linear-gradient(#464766,#2D2E43)'`                                         | Color de fondo de la página de aterrizaje. Este parámetro acepta argumentos válidos de color de fondo CSS. El color de fondo no se muestra si se establece un background-src o sceneEnvMap. |
| mediaSrc               | Cadena            | Imagen de portada de la aplicación, si existe                                | Fuente multimedia (modelo 3D, imagen o vídeo) para el contenido principal de la página de destino. Las fuentes de medios aceptadas incluyen a-asset-item id, o URL estática.             |
| mediaAlt               | Cadena            | `'Vista previa'`                                                             | Texto alternativo para el contenido de las imágenes de la página de destino.                                                                                                                                                |
| mediaAutoplay          | Booleano          | `true`                                                                       | Si el `mediaSrc` es un vídeo, especifica si el vídeo debe reproducirse al cargarse con el sonido silenciado.                                                                                                                |
| mediaAnimation         | Cadena            | Primer clip de animación del modelo, si existe                               | Si el `mediaSrc` es un modelo 3D, especifique si desea reproducir un clip de animación específico asociado al modelo, o "ninguno".                                                                                          |
| mediaControls          | Cadena            | `'mínimo'`                                                                   | Si `mediaSrc` es un vídeo, especifique los controles multimedia que se muestran al usuario. Elija entre "ninguno", "mininal" o "navegador" (navegador por defecto)                                       |
| sceneEnvMap            | Cadena            | `'campo'`                                                                    | Fuente de imagen que apunta a una imagen equirectangular. O uno de los siguientes entornos preestablecidos: "campo", "colina", "ciudad", "pastel" o "espacio".                              |
| sceneOrbitIdle         | Cadena            | `'spin'`                                                                     | Si el `mediaSrc` es un modelo 3D, especifique si el modelo debe "girar", o "ninguno".                                                                                                                                       |
| sceneOrbitInteraction  | Cadena            | `'drag'`                                                                     | Si el `mediaSrc` es un modelo 3D, especifique si el usuario puede interactuar con los controles orbitales, elija "arrastrar", o "ninguno".                                                                                  |
| sceneLightingIntensity | `Número`          | `1`                                                                          | Si el `mediaSrc` es un modelo 3D, especifique la intensidad de la luz que ilumina el modo.                                                                                                                                  |
| vrPromptPrefix         | Cadena            | `'o visita'`                                                                 | Establece la cadena de texto para la llamada a la acción antes de que se muestre la URL de la experiencia en los cascos de RV.                                                                                              |

## Devuelve {#returns}

Ninguno

## Ejemplo - Código {#example---code}

```javascript
LandingPage.configure({
    mediaSrc: 'https://www.mydomain.com/bat.glb',
    sceneEnvMap: 'hill',
})
```
