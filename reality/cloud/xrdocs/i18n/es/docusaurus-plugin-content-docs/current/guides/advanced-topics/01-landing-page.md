---
id: landing-pages
---

# Páginas de aterrizaje (Landing pages)

Las páginas de aterrizaje son una evolución de nuestras populares páginas "Almost there".

## ¿Por qué utilizar páginas de aterrizaje? {#why-use-landing-pages}

Hemos transformado estas páginas para que se conviertan en potentes oportunidades de marca y marketing para usted y para sus clientes. Todas las plantillas de las páginas de aterrizaje están optimizadas para la marca y la educación con varios diseños, un diseño de código QR mejorado y compatibilidad con archivos multimedia clave.

Las páginas de aterrizaje garantizan que sus usuarios tengan una experiencia significativa, independientemente del dispositivo en el que se encuentren. \- Aparecen en dispositivos en los que no está disponible o no son capaces de acceder directamente a la experiencia WebAR. También continúan nuestra misión de hacer accesible la AR ayudando a los usuarios a llegar al destino adecuado para interactuar con la AR.

Hemos diseñado las páginas de Aterrizaje de forma que sea extremadamente fácil para los desarrolladores personalizar la página. Queremos que se beneficie de una página de aterrizaje optimizada y que, al mismo tiempo, pueda dedicar su tiempo a construir su experiencia WebAR.

## Las páginas de aterrizaje se adaptan de manera inteligente a su configuración {#landing-pages-intelligently-adapt-to-your-configuration}

![loading-examples1](/images/landing-examples1.jpg)

![loading-examples2](/images/landing-examples2.jpg)

## Utilizar páginas de aterrizaje en su proyecto {#use-landing-pages-in-your-project}

1. Abra su proyecto
2. Añada la siguiente etiqueta a `head.html`

`<meta name="8thwall:package" content="@8thwall.landing-page">`

Nota: para los proyectos autohospedado, debería añadir la siguiente etiqueta `<script>` a su página en su lugar:

`<script src='https://cdn.8thwall.com/web/landing-page/landing-page.js'></script>`

3. **Elimine** `xrextras-almost-there` de su proyecto A-Frame, o `XRExtras.AlmostThere.pipelineModule()` de su proyecto sin AFrame. (Las páginas de aterrizaje incluyen lógica "almost-there" además de las actualizaciones de la página del código QR).
4. De manera opcional, personalice los parámetros de su componente </code>landing-page` como se define a continuación. Para los proyectos
sin AFrame, consulte la documentación de <a href="/api/landingpage/configure">LandingPage.configure()</a>
.</p></li>
</ol>

<h2 id="a-frame-component-parameters" spaces-before="0">Parámetros del componente AFrame (todos opcionales)</h2>

<table spaces-before="0">
<thead>
<tr>
  <th>Parámetro</th>
  <th>Tipo</th>
  <th>Por defecto</th>
  <th>Descripción</th>
</tr>
</thead>
<tbody>
<tr>
  <td>logoSrc</td>
  <td><code>Cadena`</td> 
   
   </tr> 
   
   </tbody> </table>

## Ejemplos {#examples}

#### Disposición 3D con parámetros especificados por el usuario {#3d-layout-with-user-specified-parameters}

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

#### Ejemplo de AFrame con activo local {#a-frame-local-asset example}
```html
<a-scene
  xrextras-gesture-detector
  landing-page="mediaSrc: #myModel"
  xrextras-loading
  xrextras-runtime-error
  renderer="colorManagement: true"
  xrweb>

  <!-- Aquí podemos definir los activos que se cargarán cuando se inicialice A-Frame -->
  <a-assets>
    <a-asset-item id="myModel" src="assets/my-model.glb"></a-asset-item>
  </a-assets>
```

#### Ejemplo sin AFrame (captura de pantalla anterior) {#non-aframe-example--screenshot-above}

```js
// Configured here
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
  // Added here
  LandingPage.pipelineModule(),
  ...
])
```
