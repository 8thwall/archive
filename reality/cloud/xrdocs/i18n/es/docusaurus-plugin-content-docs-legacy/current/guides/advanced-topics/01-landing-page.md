---
id: landing-pages
---

# Páginas de destino

Las páginas de aterrizaje son una evolución de nuestras populares páginas "Almost There".

## ¿Por qué utilizar páginas de destino? {#why-use-landing-pages}

Hemos transformado estas páginas para que se conviertan en potentes oportunidades de marca y marketing para usted y
sus clientes. Todas las plantillas de páginas de aterrizaje están optimizadas para la creación de marca y la educación con varios diseños de
, un diseño de código QR mejorado y compatibilidad con medios clave.

Las páginas de destino garantizan que sus usuarios tengan una experiencia significativa independientemente del dispositivo en el que se encuentren.
\- Aparecen en dispositivos a los que no se les permite o no son capaces de acceder a la experiencia Web AR
directamente. También continúan nuestra misión de hacer accesible la realidad aumentada ayudando a los usuarios a llegar al destino
adecuado para interactuar con la realidad aumentada.

Hemos diseñado las páginas de aterrizaje de forma que sea extremadamente fácil para los desarrolladores personalizar la página
. Queremos que se beneficie de una Página de Aterrizaje optimizada y que al mismo tiempo pueda dedicar su tiempo
a construir su experiencia WebAR.

## Las páginas de destino se adaptan de forma inteligente a su configuración {#landing-pages-intelligently-adapt-to-your-configuration}

![loading-examples1](/images/landing-examples1.jpg)

![loading-examples2](/images/landing-examples2.jpg)

## Utilice páginas de destino en su proyecto {#use-landing-pages-in-your-project}

1. Abra su proyecto
2. Añada la siguiente etiqueta a `head.html`.

`<meta name="8thwall:package" content="@8thwall.landing-page">`

Nota: Para proyectos autoalojados, añada la siguiente etiqueta `<script>` a su página:

`<script src='https://cdn.8thwall.com/web/landing-page/landing-page.js'></script>`

3. **Quita** `xrextras-almost-there` de tu proyecto A-Frame, o
   `XRExtras.AlmostThere.pipelineModule()` de tu proyecto Non-AFrame. (Las páginas de aterrizaje incluyen
   casi lógica además de las actualizaciones de la página de códigos QR).
4. Opcionalmente, personalice los parámetros de su componente `landing-page` como se define a continuación. Para proyectos
   que no sean de marco, consulte la documentación [LandingPage.configure()](/legacy/api/landingpage/configure)
   .

## Parámetros del componente A-Frame (Todos opcionales) {#a-frame-component-parameters}

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

## Ejemplos {#examples}

#### Trazado 3D con parámetros especificados por el usuario {#3d-layout-with-user-specified-parameters}

![loading-example](/images/landingpage-example.jpg)

#### Ejemplo de A-Frame con URL externa (captura de pantalla anterior) {#a-frame-example}

```html
<a-scene
  landing-page="
    mediaSrc: https://www.mydomain.com/helmet.glb;
    sceneEnvMap: hill"
  xrextras-loading
  xrextras-gesture-detector
  ...
  xrweb>
```

#### Ejemplo de marco en A con activos locales {#a-frame-local-asset example}

```html
<a-scene
  xrextras-gesture-detector
  landing-page="mediaSrc: #myModel"
  xrextras-loading
  xrextras-runtime-error
  renderer="colorManagement: true"
  xrweb>

  <!-- We can define assets here to be loaded when A-Frame initializes -->
  <a-assets>
    <a-asset-item id="myModel" src="assets/my-model.glb"></a-asset-item>
  </a-assets>
```

#### Ejemplo sin marco (captura de pantalla anterior) {#non-aframe-example--screenshot-above}

```js
// Configurado aquí
LandingPage.configure({
    mediaSrc: 'https://www.mydomain.com/bat.glb',
    sceneEnvMap: 'hill',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  // Añadido aquí
  LandingPage.pipelineModule(),
  ...
])
```
